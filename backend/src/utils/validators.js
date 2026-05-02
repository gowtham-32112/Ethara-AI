const { z } = require('zod');

// ─── Auth ────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email/Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  requestAdmin: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().min(1, 'Email/Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Project ─────────────────────────────────────────
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

// ─── Task ────────────────────────────────────────────
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
});

// ─── Members ─────────────────────────────────────────
const addMemberSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  addMemberSchema,
};
