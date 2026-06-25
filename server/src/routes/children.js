const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, seedDefaultTasks, getChildWithTasks, todayStr } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM children WHERE user_id = ? ORDER BY created_at')
    .all(req.user.userId);

  const children = rows.map(row => {
    const full = getChildWithTasks(row.id, req.user.userId);
    return full;
  });

  res.json({ children });
});

router.post('/', (req, res) => {
  const { name, age, gender, avatar, photoUri } = req.body;

  if (!name?.trim() || !age || !gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required' });
  }

  const id = uuidv4();
  db.prepare(`
    INSERT INTO children (id, user_id, name, age, gender, avatar_json, photo_uri)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.user.userId,
    name.trim(),
    Number(age),
    gender,
    avatar ? JSON.stringify(avatar) : null,
    photoUri || null
  );

  seedDefaultTasks(id);
  db.prepare('UPDATE children SET last_reset_date = ? WHERE id = ?').run(todayStr(), id);
  const child = getChildWithTasks(id, req.user.userId);
  res.status(201).json({ child });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db
    .prepare('SELECT * FROM children WHERE id = ? AND user_id = ?')
    .get(id, req.user.userId);

  if (!existing) {
    return res.status(404).json({ error: 'Child not found' });
  }

  const { name, age, gender, avatar, photoUri } = req.body;
  db.prepare(`
    UPDATE children SET
      name = COALESCE(?, name),
      age = COALESCE(?, age),
      gender = COALESCE(?, gender),
      avatar_json = COALESCE(?, avatar_json),
      photo_uri = COALESCE(?, photo_uri)
    WHERE id = ?
  `).run(
    name?.trim() || null,
    age != null ? Number(age) : null,
    gender || null,
    avatar ? JSON.stringify(avatar) : null,
    photoUri !== undefined ? photoUri : null,
    id
  );

  const child = getChildWithTasks(id, req.user.userId);
  res.json({ child });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare('DELETE FROM children WHERE id = ? AND user_id = ?')
    .run(id, req.user.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Child not found' });
  }

  res.json({ success: true });
});

module.exports = router;
