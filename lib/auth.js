const crypto = require('crypto');
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const COOKIE = 'jns_admin';
const TTL = 1000 * 60 * 60 * 12;

const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');
const safeEq = (a, b) => {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

function issue(res) {
  const exp = String(Date.now() + TTL);
  const val = `${exp}.${sign(exp)}`;
  res.setHeader('Set-Cookie', `${COOKIE}=${val}; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=${TTL / 1000}${process.env.NODE_ENV === 'production' || process.env.RENDER ? '; Secure' : ''}`);
}
function clear(res) { res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/admin; Max-Age=0`); }
function isAuthed(req) {
  const m = (req.headers.cookie || '').match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  return !!exp && !!sig && safeEq(sig, sign(exp)) && Number(exp) > Date.now();
}
function require_(req, res, next) {
  if (isAuthed(req)) return next();
  if (req.path.startsWith('/api')) return res.status(401).json({ error: 'unauthorized' });
  return res.redirect('/admin/login');
}
function checkPassword(pw) {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEq(pw || '', expected);
}
module.exports = { issue, clear, isAuthed, require: require_, checkPassword };
