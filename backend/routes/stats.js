const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/timeline', authenticate, requireAdmin, statsController.getTimeline);
router.get('/', statsController.getStats);

module.exports = router;
