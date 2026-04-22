const { db } = require('../config/db');

function logViewEvent(resourceId) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO view_events (resource_id) VALUES (?)', [resourceId], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

function incrementView(resourceId) {
  const sql = `
    INSERT INTO resource_views (resource_id, count) VALUES (?, 1)
    ON CONFLICT(resource_id) DO UPDATE SET count = count + 1
  `;
  return new Promise((resolve, reject) => {
    db.run(sql, [resourceId], function (err) {
      if (err) return reject(err);
      const changes = this.changes;
      logViewEvent(resourceId)
        .then(() => resolve({ changes }))
        .catch(reject);
    });
  });
}

/** Fills missing calendar days with count 0 for charts. */
function getVisitsByDay(dayCount, resourceId) {
  const days = Math.min(Math.max(parseInt(dayCount, 10) || 30, 1), 90);
  const mod = `-${days} day`;
  let sql = `
    SELECT date(viewed_at) AS d, COUNT(*) AS c
    FROM view_events
    WHERE date(viewed_at) >= date('now', ?)
  `;
  const params = [mod];
  if (resourceId != null) {
    sql += ' AND resource_id = ?';
    params.push(resourceId);
  }
  sql += ' GROUP BY date(viewed_at) ORDER BY d';

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      const byDay = {};
      (rows || []).forEach((r) => {
        byDay[r.d] = r.c;
      });
      const out = [];
      const now = new Date();
      const utcDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      for (let k = 0; k < days; k += 1) {
        const t = new Date(utcDay);
        t.setUTCDate(utcDay.getUTCDate() - (days - 1 - k));
        const key = t.toISOString().slice(0, 10);
        out.push({
          date: key,
          count: byDay[key] || 0,
          label: key.slice(5),
        });
      }
      resolve({ days, series: out });
    });
  });
}

function getTopPopular(limit = 10) {
  const sql = `
    SELECT rv.resource_id, rv.count, r.title, r.category, r.type
    FROM resource_views rv
    JOIN resources r ON r.id = rv.resource_id
    ORDER BY rv.count DESC
    LIMIT ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = { incrementView, getTopPopular, getVisitsByDay };
