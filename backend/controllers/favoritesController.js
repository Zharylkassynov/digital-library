const favoriteModel = require('../models/favoriteModel');
const resourceModel = require('../models/resourceModel');
const { parsePositiveInt } = require('../utils/validators');

async function list(req, res) {
  try {
    const rows = await favoriteModel.listWithResources(req.user.id);
    const favorites = rows.map((row) => ({
      id: row.favorite_id,
      resource: {
        id: row.resource_id,
        title: row.title,
        description: row.description,
        category: row.category,
        type: row.type,
        author: row.author,
        year: row.year,
        image: row.image,
        link: row.link,
      },
    }));
    return res.json({ favorites });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load favorites' });
  }
}

async function add(req, res) {
  const resourceId = req.body?.resource_id;
  const parsed = parsePositiveInt(resourceId, 'resource_id');
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const resource = await resourceModel.getById(parsed.value);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const { id } = await favoriteModel.create(req.user.id, parsed.value);
    return res.status(201).json({ id, resource_id: parsed.value });
  } catch (err) {
    if (err.code === 'DUPLICATE') {
      return res.status(409).json({ error: 'Already in favorites' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
}

async function remove(req, res) {
  const parsed = parsePositiveInt(req.params.id, 'favorite id');
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const result = await favoriteModel.removeById(parsed.value, req.user.id);
    if (!result.changes) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to remove favorite' });
  }
}

module.exports = { list, add, remove };
