const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'maacare.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS children (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    avatar_json TEXT,
    photo_uri TEXT,
    last_reset_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    title TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '✅',
    completed INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL CHECK (category IN ('morning', 'night')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS daily_progress (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    date TEXT NOT NULL,
    completed_count INTEGER NOT NULL DEFAULT 0,
    total_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (child_id, date),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  );
`);

// Migration for existing databases
try {
  db.prepare('SELECT last_reset_date FROM children LIMIT 1').get();
} catch {
  db.exec('ALTER TABLE children ADD COLUMN last_reset_date TEXT');
}

const DEFAULT_MORNING = [
  { title: 'Wake up early', icon: '☀️' },
  { title: 'Brush teeth', icon: '🦷' },
  { title: 'Wash face', icon: '💧' },
  { title: 'Get dressed', icon: '👕' },
  { title: 'Eat breakfast', icon: '🍳' },
  { title: 'Pack school bag', icon: '🎒' },
];

const DEFAULT_NIGHT = [
  { title: 'Finish homework', icon: '📚' },
  { title: 'Put away toys', icon: '🧸' },
  { title: 'Take a bath', icon: '🛁' },
  { title: 'Brush teeth', icon: '🦷' },
  { title: 'Put on pajamas', icon: '😴' },
  { title: 'Read a story', icon: '📖' },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function seedDefaultTasks(childId) {
  const insert = db.prepare(`
    INSERT INTO tasks (id, child_id, title, icon, completed, category, sort_order)
    VALUES (?, ?, ?, ?, 0, ?, ?)
  `);

  const insertMany = db.transaction((tasks, category) => {
    tasks.forEach((task, index) => {
      insert.run(`${category[0]}_${childId}_${index}`, childId, task.title, task.icon, category, index);
    });
  });

  insertMany(DEFAULT_MORNING, 'morning');
  insertMany(DEFAULT_NIGHT, 'night');
}

function resetTasksForNewDay(childId) {
  const today = todayStr();
  db.prepare('UPDATE tasks SET completed = 0 WHERE child_id = ?').run(childId);
  db.prepare('UPDATE children SET last_reset_date = ? WHERE id = ?').run(today, childId);
}

function ensureDailyReset(childId) {
  const today = todayStr();
  const child = db.prepare('SELECT last_reset_date FROM children WHERE id = ?').get(childId);
  if (!child) return;

  if (child.last_reset_date !== today) {
    resetTasksForNewDay(childId);
  }
}

function mapChild(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    avatar: row.avatar_json ? JSON.parse(row.avatar_json) : null,
    photoUri: row.photo_uri || undefined,
  };
}

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    completed: Boolean(row.completed),
    category: row.category,
  };
}

function getChildWithTasks(childId, userId) {
  const childRow = db
    .prepare('SELECT * FROM children WHERE id = ? AND user_id = ?')
    .get(childId, userId);
  if (!childRow) return null;

  ensureDailyReset(childId);

  const tasks = db
    .prepare('SELECT * FROM tasks WHERE child_id = ? ORDER BY category, sort_order')
    .all(childId)
    .map(mapTask);

  recordDailyProgress(childId);

  return {
    ...mapChild(childRow),
    morningTasks: tasks.filter(t => t.category === 'morning'),
    nightTasks: tasks.filter(t => t.category === 'night'),
  };
}

function recordDailyProgress(childId) {
  const today = todayStr();
  const stats = db
    .prepare(`
      SELECT
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_count,
        COUNT(*) as total_count
      FROM tasks WHERE child_id = ?
    `)
    .get(childId);

  db.prepare(`
    INSERT INTO daily_progress (id, child_id, date, completed_count, total_count)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(child_id, date) DO UPDATE SET
      completed_count = excluded.completed_count,
      total_count = excluded.total_count
  `).run(
    `${childId}_${today}`,
    childId,
    today,
    stats.completed_count,
    stats.total_count
  );
}

function getStreakStats(childId) {
  const rows = db
    .prepare(`
      SELECT date, completed_count, total_count
      FROM daily_progress
      WHERE child_id = ? AND total_count > 0
      ORDER BY date DESC
      LIMIT 90
    `)
    .all(childId);

  const byDate = new Map(rows.map(r => [r.date, r]));
  const today = todayStr();
  let checkDate = new Date(`${today}T12:00:00`);

  let currentStreak = 0;
  let perfectStreak = 0;
  let countingCurrent = true;
  let countingPerfect = true;

  for (let i = 0; i < 90; i++) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    const row = byDate.get(dateStr);

    if (countingCurrent) {
      if (row && row.completed_count > 0) {
        currentStreak++;
      } else if (i === 0) {
        // Today not started yet — keep checking yesterday
      } else {
        countingCurrent = false;
      }
    }

    if (countingPerfect) {
      if (row && row.completed_count === row.total_count) {
        perfectStreak++;
      } else if (i === 0) {
        // Today incomplete — keep checking yesterday for perfect streak
      } else {
        countingPerfect = false;
      }
    }

    if (!countingCurrent && !countingPerfect) break;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const perfectDays = rows.filter(r => r.completed_count === r.total_count).length;

  return { currentStreak, perfectStreak, perfectDays };
}

module.exports = {
  db,
  seedDefaultTasks,
  mapChild,
  mapTask,
  getChildWithTasks,
  recordDailyProgress,
  ensureDailyReset,
  getStreakStats,
  todayStr,
};
