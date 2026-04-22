const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', favoritesController.list);
router.post('/', favoritesController.add);
router.delete('/:id', favoritesController.remove);

module.exports = router;
