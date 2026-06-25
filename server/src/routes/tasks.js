const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, mapTask, recordDailyProgress } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

function verifyChildOwnership(childId, userId) {
  return db.prepare('SELECT id FROM children WHERE id = ? AND user_id = ?').get(childId, userId);
}

router.post('/:childId', (req, res) => {
  const { childId } = req.params;
  if (!verifyChildOwnership(childId, req.user.userId)) {
    return res.status(404).json({ error: 'Child not found' });
  }

  const { title, icon, category } = req.body;
  if (!title?.trim() || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }
  if (!['morning', 'night'].includes(category)) {
    return res.status(400).json({ error: 'Category must be morning or night' });
  }

  const maxOrder = db
    .prepare('SELECT MAX(sort_order) as max FROM tasks WHERE child_id = ? AND category = ?')
    .get(childId, category);

  const id = `${category}_${uuidv4()}`;
  db.prepare(`
    INSERT INTO tasks (id, child_id, title, icon, completed, category, sort_order)
    VALUES (?, ?, ?, ?, 0, ?, ?)
  `).run(id, childId, title.trim(), icon || '✅', category, (maxOrder?.max ?? -1) + 1);

  recordDailyProgress(childId);
  const task = mapTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  res.status(201).json({ task });
});

router.put('/:taskId', (req, res) => {
  const { taskId } = req.params;
  const existing = db.prepare(`
    SELECT t.*, c.user_id FROM tasks t
    JOIN children c ON c.id = t.child_id
    WHERE t.id = ?
  `).get(taskId);

  if (!existing || existing.user_id !== req.user.userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, icon, completed, category } = req.body;
  db.prepare(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      icon = COALESCE(?, icon),
      completed = COALESCE(?, completed),
      category = COALESCE(?, category)
    WHERE id = ?
  `).run(
    title?.trim() || null,
    icon || null,
    completed !== undefined ? (completed ? 1 : 0) : null,
    category || null,
    taskId
  );

  recordDailyProgress(existing.child_id);
  const task = mapTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId));
  res.json({ task });
});

router.patch('/:taskId/toggle', (req, res) => {
  const { taskId } = req.params;
  const existing = db.prepare(`
    SELECT t.*, c.user_id FROM tasks t
    JOIN children c ON c.id = t.child_id
    WHERE t.id = ?
  `).get(taskId);

  if (!existing || existing.user_id !== req.user.userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const newCompleted = existing.completed ? 0 : 1;
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(newCompleted, taskId);
  recordDailyProgress(existing.child_id);

  const task = mapTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId));
  res.json({ task });
});

router.delete('/:taskId', (req, res) => {
  const { taskId } = req.params;
  const existing = db.prepare(`
    SELECT t.*, c.user_id FROM tasks t
    JOIN children c ON c.id = t.child_id
    WHERE t.id = ?
  `).get(taskId);

  if (!existing || existing.user_id !== req.user.userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  recordDailyProgress(existing.child_id);
  res.json({ success: true });
});

module.exports = router;
