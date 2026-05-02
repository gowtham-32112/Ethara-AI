const { Router } = require('express');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { authenticate, requireProjectAdmin, requireProjectMember, requireGlobalAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  createTaskSchema,
} = require('../utils/validators');

const router = Router();

// All routes require authentication
router.use(authenticate);

// ─── Projects CRUD ───────────────────────────────────
router.post('/', requireGlobalAdmin, validate(createProjectSchema), projectController.create);
router.get('/', projectController.list);
router.get('/:id', requireProjectMember, projectController.getById);
router.put('/:id', requireProjectAdmin, validate(updateProjectSchema), projectController.update);
router.delete('/:id', requireProjectAdmin, projectController.delete);

// ─── Members ─────────────────────────────────────────
router.post('/:id/members', requireProjectAdmin, validate(addMemberSchema), projectController.addMember);
router.delete('/:id/members/:userId', requireProjectAdmin, projectController.removeMember);

// ─── Tasks ───────────────────────────────────────────
router.get('/:id/tasks', requireProjectMember, taskController.listByProject);
router.post('/:id/tasks', requireProjectAdmin, validate(createTaskSchema), taskController.create);

// ─── Dashboard ───────────────────────────────────────
router.get('/:id/dashboard', requireProjectMember, taskController.dashboard);

module.exports = router;
