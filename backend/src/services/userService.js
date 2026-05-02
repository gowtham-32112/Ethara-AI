const prisma = require('../config/db');

class UserService {
  /**
   * Search users by name or email (for adding members)
   */
  async search(query) {
    if (!query || query.length < 2) return [];

    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: { id: true, name: true, email: true },
      take: 10,
    });
  }
}

module.exports = new UserService();
