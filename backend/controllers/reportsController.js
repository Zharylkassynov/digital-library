const reportModel = require('../models/reportModel');
const resourceModel = require('../models/resourceModel');
const { pickErrors, parsePositiveInt } = require('../utils/validators');

async function create(req, res) {
  const { resource_id, message } = req.body || {};
  const hasResource =
    resource_id != null && resource_id !== '' && !Number.isNaN(parseInt(resource_id, 10));
  const errors = pickErrors(
    { message },
    { message: { required: true } }
  );
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  const text = String(message).trim();
  try {
    if (hasResource) {
      const parsed = parsePositiveInt(resource_id, 'resource_id');
      if (parsed.error) {
        return res.status(400).json({ error: parsed.error });
      }
      const resource = await resourceModel.getById(parsed.value);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      const { id } = await reportModel.create(parsed.value, text);
      return res.status(201).json({ id, resource_id: parsed.value });
    }
    const { id } = await reportModel.create(null, text);
    return res.status(201).json({ id, resource_id: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit report' });
  }
}

async function list(req, res) {
  try {
    const reports = await reportModel.listAll();
    return res.json({ reports });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load reports' });
  }
}

module.exports = { create, list };
