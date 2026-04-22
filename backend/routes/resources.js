const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/filters', resourcesController.getFilters);
router.get('/random', resourcesController.getRandom);
router.get('/', resourcesController.getAll);
router.post('/', authenticate, requireAdmin, resourcesController.create);
router.post('/:id/view', resourcesController.recordView);
router.put('/:id', authenticate, requireAdmin, resourcesController.update);
router.delete('/:id', authenticate, requireAdmin, resourcesController.remove);
router.get('/:id', resourcesController.getById);

module.exports = router;
