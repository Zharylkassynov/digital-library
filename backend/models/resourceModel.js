const { db } = require("../config/db");

function getAll(options = {}) {
  const { search, category, type } = options;
  let sql = "SELECT * FROM resources WHERE 1=1";
  const params = [];

  if (search && search.trim()) {
    sql += " AND title LIKE ?";
    params.push(`%${search.trim()}%`);
  }
  if (category && category.trim()) {
    sql += " AND category = ?";
    params.push(category.trim());
  }
  if (type && type.trim()) {
    sql += " AND type = ?";
    params.push(type.trim());
  }

  sql += " ORDER BY id";

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM resources WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function insert(resource) {
  const sql = `
    INSERT INTO resources (title, description, category, type, author, year, image, link)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    resource.title,
    resource.description,
    resource.category,
    resource.type,
    resource.author,
    resource.year,
    resource.image || null,
    resource.link || null,
  ];
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function insertMany(resources) {
  return Promise.all(resources.map((r) => insert(r)));
}

function getRandom(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM resources ORDER BY RANDOM() LIMIT ?',
      [limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

function update(id, resource) {
  const sql = `
    UPDATE resources SET
      title = ?, description = ?, category = ?, type = ?,
      author = ?, year = ?, image = ?, link = ?
    WHERE id = ?
  `;
  const params = [
    resource.title,
    resource.description,
    resource.category,
    resource.type,
    resource.author ?? null,
    resource.year ?? null,
    resource.image ?? null,
    resource.link ?? null,
    id,
  ];
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM resources WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

function distinctCategories() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT TRIM(category) AS v FROM resources
       WHERE category IS NOT NULL AND TRIM(category) != '' ORDER BY v`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []).map((r) => r.v).filter(Boolean));
      }
    );
  });
}

function distinctTypes() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT TRIM(type) AS v FROM resources
       WHERE type IS NOT NULL AND TRIM(type) != '' ORDER BY v`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []).map((r) => r.v).filter(Boolean));
      }
    );
  });
}

module.exports = {
  getAll,
  getById,
  insert,
  insertMany,
  getRandom,
  update,
  remove,
  distinctCategories,
  distinctTypes,
};
