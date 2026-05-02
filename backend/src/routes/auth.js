const { Router } = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validators');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
