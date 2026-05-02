const taskService = require('../services/taskService');

const taskController = {
  async create(req, res, next) {
    try {
      const task = await taskService.create(req.params.id, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  async listByProject(req, res, next) {
    try {
      const { status, priority, assigneeId } = req.query;
      const tasks = await taskService.listByProject(req.params.id, {
        status,
        priority,
        assigneeId,
      });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      // RBAC: Members can only update tasks assigned to them
      const task = await taskService.getById(req.params.id);

      // Find membership for this task's project
      const prisma = require('../config/db');
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: req.user.id,
            projectId: task.projectId,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({ error: 'Not a member of this project' });
      }

      // Members can only update tasks assigned to them
      if (membership.role === 'MEMBER' && task.assigneeId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update tasks assigned to you' });
      }

      // Members cannot reassign tasks or change certain fields
      if (membership.role === 'MEMBER') {
        // Only allow status updates for members
        const allowed = { status: req.body.status };
        const updated = await taskService.update(req.params.id, allowed);
        return res.json(updated);
      }

      const updated = await taskService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      // Only admins can delete — enforced by route middleware
      const task = await taskService.getById(req.params.id);
      // Verify task belongs to the project and user is admin
      const prisma = require('../config/db');
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: req.user.id,
            projectId: task.projectId,
          },
        },
      });

      if (!membership || membership.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete tasks' });
      }

      await taskService.delete(req.params.id);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      next(err);
    }
  },

  async dashboard(req, res, next) {
    try {
      const stats = await taskService.getDashboard(req.params.id);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = taskController;
