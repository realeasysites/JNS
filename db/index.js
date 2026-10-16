const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const file = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'leads.db');
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new Database(file);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  town TEXT,
  service TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);
module.exports = db;
