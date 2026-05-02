const prisma = require('../config/db');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password, requestAdmin }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const hashed = await hashPassword(password);
    const globalRole = requestAdmin ? 'PENDING_ADMIN' : 'USER';
    
    const user = await prisma.user.create({
      data: { name, email, password: hashed, globalRole },
      select: { id: true, name: true, email: true, globalRole: true, createdAt: true },
    });

    const token = signToken({ id: user.id, email: user.email, globalRole: user.globalRole });
    return { user, token };
  }

  /**
   * Login user and return JWT
   */
  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken({ id: user.id, email: user.email, globalRole: user.globalRole });
    return {
      user: { id: user.id, name: user.name, email: user.email, globalRole: user.globalRole },
      token,
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, globalRole: true, createdAt: true },
    });
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = new AuthService();
