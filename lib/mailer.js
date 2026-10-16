const nodemailer = require('nodemailer');
let transporter = null;
function get() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}
const esc = (s) => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function notifyLead(l) {
  const t = get();
  const to = process.env.NOTIFY_EMAIL;
  if (!t || !to) { console.log('[mailer] SMTP not configured; lead saved only.'); return; }
  await t.sendMail({
    from: `"Jalbert n' Sons Website" <${process.env.SMTP_USER}>`, to,
    replyTo: l.email || undefined,
    subject: `New estimate request: ${l.name}${l.service ? ' – ' + l.service : ''}`,
    html: `<h2>New estimate request</h2>
<p><b>${esc(l.name)}</b><br>Phone: <a href="tel:${esc(l.phone)}">${esc(l.phone)}</a><br>Email: ${esc(l.email) || '—'}<br>Town: ${esc(l.town) || '—'}</p>
<p>Service: ${esc(l.service) || '—'}<br>Timeline: ${esc(l.timeline) || '—'}</p>
<p>${esc(l.message).replace(/\n/g, '<br>') || '—'}</p>`
  });
}
module.exports = { notifyLead };
