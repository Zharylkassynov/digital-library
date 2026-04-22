const resourceModel = require('../models/resourceModel');
const statsModel = require('../models/statsModel');
const { pickErrors, parsePositiveInt } = require('../utils/validators');

const DEFAULT_FILTER_CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Business',
  'Research',
];
const DEFAULT_FILTER_TYPES = ['Book', 'Article', 'Database', 'Website'];

const resourceRules = {
  title: { required: true },
  description: { required: true },
  category: { required: true },
  type: { required: true },
};

function normalizeResourceBody(body) {
  return {
    title: body.title?.trim(),
    description: body.description?.trim(),
    category: body.category?.trim(),
    type: body.type?.trim(),
    author: body.author?.trim() || null,
    year: body.year != null && body.year !== '' ? parseInt(body.year, 10) : null,
    image: body.image?.trim() || null,
    link: body.link?.trim() || null,
  };
}

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

async function getFilters(req, res) {
  try {
    const [c, t] = await Promise.all([
      resourceModel.distinctCategories(),
      resourceModel.distinctTypes(),
    ]);
    const categories = [...new Set([...DEFAULT_FILTER_CATEGORIES, ...c])].sort();
    const types = [...new Set([...DEFAULT_FILTER_TYPES, ...t])].sort();
    res.json({ categories, types });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load filter options' });
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
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const resources = await resourceModel.getRandom(limit);
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random resources' });
  }
}

async function recordView(req, res) {
  const parsed = parsePositiveInt(req.params.id, 'resource id');
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const resource = await resourceModel.getById(parsed.value);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    await statsModel.incrementView(parsed.value);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to record view' });
  }
}

async function create(req, res) {
  const normalized = normalizeResourceBody(req.body || {});
  const errors = pickErrors(
    {
      title: normalized.title,
      description: normalized.description,
      category: normalized.category,
      type: normalized.type,
    },
    resourceRules
  );
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (normalized.year !== null && Number.isNaN(normalized.year)) {
    return res.status(400).json({ error: 'Invalid year' });
  }
  try {
    const { id } = await resourceModel.insert(normalized);
    const created = await resourceModel.getById(id);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create resource' });
  }
}

async function update(req, res) {
  const parsed = parsePositiveInt(req.params.id, 'resource id');
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const normalized = normalizeResourceBody(req.body || {});
  const errors = pickErrors(
    {
      title: normalized.title,
      description: normalized.description,
      category: normalized.category,
      type: normalized.type,
    },
    resourceRules
  );
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (normalized.year !== null && Number.isNaN(normalized.year)) {
    return res.status(400).json({ error: 'Invalid year' });
  }
  try {
    const existing = await resourceModel.getById(parsed.value);
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const result = await resourceModel.update(parsed.value, normalized);
    if (!result.changes) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const updated = await resourceModel.getById(parsed.value);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update resource' });
  }
}

async function remove(req, res) {
  const parsed = parsePositiveInt(req.params.id, 'resource id');
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const result = await resourceModel.remove(parsed.value);
    if (!result.changes) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete resource' });
  }
}

module.exports = {
  getAll,
  getFilters,
  getById,
  getRandom,
  recordView,
  create,
  update,
  remove,
};
