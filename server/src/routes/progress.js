const express = require('express');
const { db, getStreakStats } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/:childId/weekly', (req, res) => {
  const { childId } = req.params;
  const child = db
    .prepare('SELECT id FROM children WHERE id = ? AND user_id = ?')
    .get(childId, req.user.userId);

  if (!child) {
    return res.status(404).json({ error: 'Child not found' });
  }

  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const row = db
      .prepare('SELECT * FROM daily_progress WHERE child_id = ? AND date = ?')
      .get(childId, dateStr);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.push({
      date: dateStr,
      label: dayNames[d.getDay()],
      progress: row && row.total_count > 0
        ? Math.round((row.completed_count / row.total_count) * 100)
        : 0,
      completed: row?.completed_count ?? 0,
      total: row?.total_count ?? 0,
    });
  }

  res.json({ days });
});

router.get('/:childId/streaks', (req, res) => {
  const { childId } = req.params;
  const child = db
    .prepare('SELECT id FROM children WHERE id = ? AND user_id = ?')
    .get(childId, req.user.userId);

  if (!child) {
    return res.status(404).json({ error: 'Child not found' });
  }

  const streaks = getStreakStats(childId);
  res.json({ streaks });
});

module.exports = router;
