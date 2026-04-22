const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/requireAdmin');

router.post('/', reportsController.create);
router.get('/', authenticate, requireAdmin, reportsController.list);

module.exports = router;
