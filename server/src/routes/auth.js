const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Password reset request
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(normalizedEmail);
  if (!user) {
    // Do not reveal whether account exists
    return res.json({ ok: true });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour

  db.prepare('INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
    .run(uuidv4(), user.id, token, expiresAt);
  // Try to send an email if SendGrid is configured, otherwise behave as before.
  const payload = { ok: true };
  try {
    const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
    const SENDER = process.env.SENDER_EMAIL;
    const FRONTEND = process.env.FRONTEND_URL;
    if (SENDGRID_KEY && SENDER && FRONTEND) {
      const sg = require('@sendgrid/mail');
      sg.setApiKey(SENDGRID_KEY);
      const resetUrl = `${FRONTEND.replace(/\/$/, '')}/reset-password?token=${token}`;
      const msg = {
        to: normalizedEmail,
        from: SENDER,
        subject: 'MaaCare — Password reset',
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Tap the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      };
      await sg.send(msg);
      console.log(`Sent password reset email to ${normalizedEmail}`);
    } else {
      // non-production/dev fallback: include token in response
      if (process.env.NODE_ENV !== 'production') payload.token = token;
      console.log(`Password reset token for ${normalizedEmail}: ${token}`);
    }
  } catch (err) {
    console.error('Failed to send reset email', err?.message || err);
    if (process.env.NODE_ENV !== 'production') payload.token = token;
  }

  res.json(payload);
});

// Reset using token
router.post('/reset', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const row = db.prepare('SELECT * FROM password_resets WHERE token = ?').get(token);
  if (!row) return res.status(400).json({ error: 'Invalid or expired token' });
  if (new Date(row.expires_at) < new Date()) {
    db.prepare('DELETE FROM password_resets WHERE token = ?').run(token);
    return res.status(400).json({ error: 'Token expired' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, row.user_id);
  db.prepare('DELETE FROM password_resets WHERE token = ?').run(token);

  res.json({ ok: true });
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const id = uuidv4();
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(
    id,
    name.trim(),
    normalizedEmail,
    passwordHash
  );

  const token = jwt.sign({ userId: id, email: normalizedEmail }, JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({
    token,
    user: { id, name: name.trim(), email: normalizedEmail },
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

module.exports = router;
