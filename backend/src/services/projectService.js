const prisma = require('../config/db');

class ProjectService {
  /**
   * Create a project and make the creator an ADMIN member
   */
  async create({ name, description, userId }) {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
        members: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    return project;
  }

  /**
   * List all projects the user belongs to
   */
  async listByUser(userId) {
    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: { select: { tasks: true, members: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
    return memberships.map((m) => ({
      ...m.project,
      role: m.role,
      taskCount: m.project._count.tasks,
      memberCount: m.project._count.members,
    }));
  }

  /**
   * Get a single project by ID (with members and task stats)
   */
  async getById(projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) {
      const err = new Error('Project not found');
      err.statusCode = 404;
      throw err;
    }
    return project;
  }

  /**
   * Update project details (Admin only)
   */
  async update(projectId, data) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  /**
   * Delete a project (Admin only)
   */
  async delete(projectId) {
    return prisma.project.delete({ where: { id: projectId } });
  }

  /**
   * Add a member to the project by email
   */
  async addMember(projectId, email, role = 'MEMBER') {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const err = new Error('User not found with that email');
      err.statusCode = 404;
      throw err;
    }

    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    if (existing) {
      const err = new Error('User is already a member of this project');
      err.statusCode = 409;
      throw err;
    }

    const member = await prisma.projectMember.create({
      data: { userId: user.id, projectId, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return member;
  }

  /**
   * Remove a member from the project
   */
  async removeMember(projectId, userId) {
    // Prevent removing self if you're the last admin
    const admins = await prisma.projectMember.findMany({
      where: { projectId, role: 'ADMIN' },
    });
    const isLastAdmin = admins.length === 1 && admins[0].userId === userId;
    if (isLastAdmin) {
      const err = new Error('Cannot remove the last admin');
      err.statusCode = 400;
      throw err;
    }

    return prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } },
    });
  }
}

module.exports = new ProjectService();
