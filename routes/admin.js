const path = require('path');
const express = require('express');
const db = require('../db');
const auth = require('../lib/auth');
const router = express.Router();
const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));
router.post('/login', (req, res) => {
  if (auth.checkPassword(req.body.password)) { auth.issue(res); return res.redirect('/admin'); }
  res.redirect('/admin/login?error=1');
});
router.post('/logout', (req, res) => { auth.clear(res); res.redirect('/admin/login'); });

router.use(auth.require);
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'admin.html')));
router.get('/api/leads', (req, res) => res.json(db.prepare('SELECT * FROM leads ORDER BY id DESC').all()));
router.patch('/api/leads/:id', (req, res) => {
  const { status, notes } = req.body;
  if (status !== undefined) {
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'bad status' });
    db.prepare('UPDATE leads SET status=? WHERE id=?').run(status, req.params.id);
  }
  if (notes !== undefined) db.prepare('UPDATE leads SET notes=? WHERE id=?').run(String(notes).slice(0, 2000), req.params.id);
  res.json({ ok: true });
});
module.exports = router;
