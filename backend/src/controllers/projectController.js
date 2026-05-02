const projectService = require('../services/projectService');

const projectController = {
  async create(req, res, next) {
    try {
      const project = await projectService.create({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const projects = await projectService.listByUser(req.user.id);
      res.json(projects);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);
      res.json(project);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      res.json(project);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await projectService.delete(req.params.id);
      res.json({ message: 'Project deleted' });
    } catch (err) {
      next(err);
    }
  },

  async addMember(req, res, next) {
    try {
      const member = await projectService.addMember(
        req.params.id,
        req.body.email,
        req.body.role
      );
      res.status(201).json(member);
    } catch (err) {
      next(err);
    }
  },

  async removeMember(req, res, next) {
    try {
      await projectService.removeMember(req.params.id, req.params.userId);
      res.json({ message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = projectController;
