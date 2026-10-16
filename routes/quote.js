const express = require('express');
const db = require('../db');
const { notifyLead } = require('../lib/mailer');
const router = express.Router();

const hits = new Map(); // tiny in-memory rate limit
const clip = (v, n) => String(v || '').trim().slice(0, n);

router.post('/', async (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many requests. Please call us instead.' });

  if (req.body.website) return res.json({ ok: true }); // honeypot

  const lead = {
    name: clip(req.body.name, 100), phone: clip(req.body.phone, 40), email: clip(req.body.email, 120),
    town: clip(req.body.town, 80), service: clip(req.body.service, 80),
    timeline: clip(req.body.timeline, 80), message: clip(req.body.message, 2000)
  };
  if (!lead.name || lead.phone.replace(/\D/g, '').length < 7)
    return res.status(400).json({ error: 'Please include your name and a good phone number.' });

  recent.push(now); hits.set(ip, recent);
  db.prepare(`INSERT INTO leads (name,phone,email,town,service,timeline,message) VALUES (@name,@phone,@email,@town,@service,@timeline,@message)`).run(lead);
  notifyLead(lead).catch(e => console.error('[mailer]', e.message));
  res.json({ ok: true });
});
module.exports = router;
