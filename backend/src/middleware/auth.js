const { verifyToken } = require('../utils/auth');
const prisma = require('../config/db');

/**
 * Authenticate requests via Bearer token.
 * Attaches `req.user` with { id, email, name }.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, globalRole: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Require the caller to be a project ADMIN.
 * Must be used AFTER authenticate and after :projectId is available.
 */
function requireProjectAdmin(req, res, next) {
  return requireProjectRole(['ADMIN'])(req, res, next);
}

/**
 * Require the caller to be a member (any role) of the project.
 */
function requireProjectMember(req, res, next) {
  return requireProjectRole(['ADMIN', 'MEMBER'])(req, res, next);
}

/**
 * Factory: require specific project role(s).
 */
function requireProjectRole(roles) {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID required' });
      }

      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: req.user.id,
            projectId,
          },
        },
      });

      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}

function requireGlobalAdmin(req, res, next) {
  if (req.user.globalRole !== 'ADMIN') {
    return res.status(403).json({ error: 'System Admin access required' });
  }
  next();
}

module.exports = { authenticate, requireProjectAdmin, requireProjectMember, requireGlobalAdmin };
