const prisma = require('../config/db');

class TaskService {
  /**
   * Create a new task within a project
   */
  async create(projectId, data) {
    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
    return task;
  }

  /**
   * List tasks for a project, with optional filters
   */
  async listByProject(projectId, filters = {}) {
    const where = { projectId };
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    return prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get a single task by ID
   */
  async getById(taskId) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
    });
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }
    return task;
  }

  /**
   * Update a task
   */
  async update(taskId, data) {
    const updateData = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    return prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Delete a task
   */
  async delete(taskId) {
    return prisma.task.delete({ where: { id: taskId } });
  }

  /**
   * Get dashboard statistics for a project
   */
  async getDashboard(projectId) {
    const [tasks, members] = await Promise.all([
      prisma.task.findMany({
        where: { projectId },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.projectMember.findMany({
        where: { projectId },
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    const now = new Date();

    // Status breakdown
    const byStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    tasks.forEach((t) => { byStatus[t.status] = (byStatus[t.status] || 0) + 1; });

    // Priority breakdown
    const byPriority = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    tasks.forEach((t) => { byPriority[t.priority] = (byPriority[t.priority] || 0) + 1; });

    // Overdue tasks (status != DONE and dueDate < now)
    const overdue = tasks.filter(
      (t) => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now
    );

    // Tasks per user
    const tasksByUser = {};
    tasks.forEach((t) => {
      if (t.assignee) {
        const key = t.assignee.id;
        if (!tasksByUser[key]) {
          tasksByUser[key] = { user: t.assignee, total: 0, done: 0 };
        }
        tasksByUser[key].total++;
        if (t.status === 'DONE') tasksByUser[key].done++;
      }
    });

    return {
      totalTasks: tasks.length,
      byStatus,
      byPriority,
      overdueCount: overdue.length,
      overdueTasks: overdue.slice(0, 10),
      tasksByUser: Object.values(tasksByUser),
      memberCount: members.length,
    };
  }
}

module.exports = new TaskService();
