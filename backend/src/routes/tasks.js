const { Router } = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { updateTaskSchema } = require('../utils/validators');

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task-level routes (not scoped under project — uses task ID directly)
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;
