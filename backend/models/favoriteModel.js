const { db } = require('../config/db');

function create(userId, resourceId) {
  const sql = 'INSERT INTO favorites (user_id, resource_id) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [userId, resourceId], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE'))) {
          return reject(Object.assign(new Error('Already in favorites'), { code: 'DUPLICATE' }));
        }
        return reject(err);
      }
      resolve({ id: this.lastID });
    });
  });
}

function removeById(favoriteId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function removeByResource(userId, resourceId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM favorites WHERE user_id = ? AND resource_id = ?',
      [userId, resourceId],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function listWithResources(userId) {
  const sql = `
    SELECT
      f.id AS favorite_id,
      f.resource_id,
      r.title, r.description, r.category, r.type, r.author, r.year, r.image, r.link
    FROM favorites f
    JOIN resources r ON r.id = f.resource_id
    WHERE f.user_id = ?
    ORDER BY f.id DESC
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function findByUserAndResource(userId, resourceId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM favorites WHERE user_id = ? AND resource_id = ?',
      [userId, resourceId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

module.exports = {
  create,
  removeById,
  removeByResource,
  listWithResources,
  findByUserAndResource,
};
