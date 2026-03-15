const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');

router.get('/random', resourcesController.getRandom);
router.get('/:id', resourcesController.getById);
router.get('/', resourcesController.getAll);

module.exports = router;
