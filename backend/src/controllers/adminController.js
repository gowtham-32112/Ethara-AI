const prisma = require('../config/db');

const adminController = {
  // Get all pending admin requests
  async getPendingRequests(req, res, next) {
    try {
      const pendingUsers = await prisma.user.findMany({
        where: { globalRole: 'PENDING_ADMIN' },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      res.json(pendingUsers);
    } catch (err) {
      next(err);
    }
  },

  // Approve admin request
  async approveAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id },
        data: { globalRole: 'ADMIN' },
        select: { id: true, name: true, email: true, globalRole: true },
      });
      res.json({ message: 'User approved as Admin', user });
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
      next(err);
    }
  },

  // Reject admin request (Revert to USER)
  async rejectAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const user = await prisma.user.update({
        where: { id },
        data: { globalRole: 'USER' },
        select: { id: true, name: true, email: true, globalRole: true },
      });
      res.json({ message: 'Admin request rejected, reverted to User', user });
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
      next(err);
    }
  },

  // Get all users (for assigning projects/tasks)
  async getAllUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, globalRole: true },
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
