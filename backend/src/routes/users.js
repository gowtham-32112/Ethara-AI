const { Router } = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);
router.get('/search', userController.search);

module.exports = router;
