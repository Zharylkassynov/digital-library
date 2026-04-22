const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'library.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('PRAGMA foreign_keys = ON');
  }
});

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function initTable() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      category TEXT,
      type TEXT,
      author TEXT,
      year INTEGER,
      image TEXT,
      link TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      resource_id INTEGER NOT NULL,
      UNIQUE(user_id, resource_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS resource_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL UNIQUE,
      count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS view_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL,
      viewed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    )`,
    `CREATE INDEX IF NOT EXISTS idx_view_events_viewed_at ON view_events(viewed_at)`,
    `CREATE INDEX IF NOT EXISTS idx_view_events_resource ON view_events(resource_id)`,
  ];

  return statements.reduce(
    (p, sql) => p.then(() => run(sql)),
    Promise.resolve()
  );
}

/** Allow site-wide reports: resource_id may be NULL (older DBs were NOT NULL). */
function migrateReportsResourceIdNullable() {
  return new Promise((resolve, reject) => {
    db.all('PRAGMA table_info(reports)', (err, rows) => {
      if (err) return reject(err);
      if (!rows || !rows.length) return resolve();
      const rid = rows.find((c) => c.name === 'resource_id');
      if (rid && rid.notnull === 0) return resolve();
      const sqls = [
        `CREATE TABLE reports__new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resource_id INTEGER,
          message TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
        )`,
        `INSERT INTO reports__new (id, resource_id, message, created_at)
         SELECT id, resource_id, message, created_at FROM reports`,
        `DROP TABLE reports`,
        `ALTER TABLE reports__new RENAME TO reports`,
      ];
      let chain = Promise.resolve();
      sqls.forEach((s) => {
        chain = chain.then(() => run(s));
      });
      chain.then(resolve).catch(reject);
    });
  });
}

function initAll() {
  return initTable().then(() => migrateReportsResourceIdNullable());
}

module.exports = { db, initTable, initAll };
