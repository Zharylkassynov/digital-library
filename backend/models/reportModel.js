const { db } = require('../config/db');

function create(resourceId, message) {
  const sql = 'INSERT INTO reports (resource_id, message) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [resourceId ?? null, message.trim()], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function listAll() {
  const sql = `
    SELECT
      rep.id,
      rep.resource_id,
      rep.message,
      rep.created_at,
      COALESCE(r.title, '(Site / general)') AS resource_title
    FROM reports rep
    LEFT JOIN resources r ON r.id = rep.resource_id
    ORDER BY rep.id DESC
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = { create, listAll };
