const resourceModel = require('../models/resourceModel');

async function getAll(req, res) {
  try {
    const { search, category, type } = req.query;
    const resources = await resourceModel.getAll({ search, category, type });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource id' });
    }
    const resource = await resourceModel.getById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
}

async function getRandom(req, res) {
  try {
    const resources = await resourceModel.getRandom(10);
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random resources' });
  }
}

module.exports = {
  getAll,
  getById,
  getRandom
};
