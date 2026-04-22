const { db } = require('../config/db');

function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email, password_hash, role, created_at FROM users WHERE email = ?',
      [email.trim().toLowerCase()],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

function findByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email, password_hash, role, created_at FROM users WHERE username = ?',
      [username.trim()],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email, password_hash, role, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

function create({ username, email, passwordHash, role = 'user' }) {
  const sql = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [username.trim(), email.trim().toLowerCase(), passwordHash, role],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

function setRoleByEmail(email, role) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET role = ? WHERE email = ?',
      [role, email.trim().toLowerCase()],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

function setRoleById(id, role) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  create,
  setRoleByEmail,
  setRoleById,
};
