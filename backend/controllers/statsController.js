const statsModel = require('../models/statsModel');

async function getStats(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  try {
    const popular = await statsModel.getTopPopular(limit);
    return res.json({ popular });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load stats' });
  }
}

async function getTimeline(req, res) {
  const daysQ = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);
  let resourceId = null;
  if (req.query.resourceId != null && String(req.query.resourceId).trim() !== '') {
    const n = parseInt(req.query.resourceId, 10);
    if (Number.isNaN(n) || n < 1) {
      return res.status(400).json({ error: 'Invalid resourceId' });
    }
    resourceId = n;
  }
  try {
    const { days, series } = await statsModel.getVisitsByDay(daysQ, resourceId);
    return res.json({ days, series, resourceId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load visit timeline' });
  }
}

module.exports = { getStats, getTimeline };
