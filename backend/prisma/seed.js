/**
 * Seed script — creates demo users and a sample project with tasks.
 * Run: npm run db:seed
 */
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up old data to ensure fresh seed
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('   Cleaned old data.');

  // Create main admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const mainAdmin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: { globalRole: 'ADMIN' },
    create: { name: 'Main Admin', email: 'admin', password: adminPassword, globalRole: 'ADMIN' },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: { globalRole: 'USER' },
    create: { name: 'Alice Johnson', email: 'alice@example.com', password: adminPassword, globalRole: 'USER' },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: { globalRole: 'USER' },
    create: { name: 'Bob Smith', email: 'bob@example.com', password: adminPassword, globalRole: 'USER' },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: { globalRole: 'PENDING_ADMIN' },
    create: { name: 'Charlie (Pending)', email: 'charlie@example.com', password: adminPassword, globalRole: 'PENDING_ADMIN' },
  });

  // Create a demo project
  const project = await prisma.project.upsert({
    where: { id: 'demo-project-001' },
    update: {},
    create: {
      id: 'demo-project-001',
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      createdById: mainAdmin.id,
    },
  });

  // Add members
  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: mainAdmin.id, projectId: project.id } },
    update: {},
    create: { userId: mainAdmin.id, projectId: project.id, role: 'ADMIN' },
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: alice.id, projectId: project.id } },
    update: {},
    create: { userId: alice.id, projectId: project.id, role: 'MEMBER' },
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: bob.id, projectId: project.id } },
    update: {},
    create: { userId: bob.id, projectId: project.id, role: 'MEMBER' },
  });

  // Create sample tasks
  const tasks = [
    { title: 'Design new homepage mockup', description: 'Create Figma mockups for the new homepage layout', status: 'DONE', priority: 'HIGH', assigneeId: alice.id, dueDate: new Date('2026-04-28') },
    { title: 'Implement responsive navbar', description: 'Build a mobile-friendly navigation bar with hamburger menu', status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: bob.id, dueDate: new Date('2026-05-05') },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated deployments', status: 'TODO', priority: 'MEDIUM', assigneeId: charlie.id, dueDate: new Date('2026-05-10') },
    { title: 'Write API documentation', description: 'Document all REST endpoints with examples', status: 'TODO', priority: 'LOW', assigneeId: bob.id, dueDate: new Date('2026-05-15') },
    { title: 'User authentication flow', description: 'Implement login, register, and password reset', status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: alice.id, dueDate: new Date('2026-05-03') },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: { ...task, projectId: project.id },
    });
  }

  console.log('✅ Seeding complete!');
  console.log('   Demo accounts:');
  console.log('   - admin / admin123 (Main Admin)');
  console.log('   - alice@example.com / admin123 (Regular User)');
  console.log('   - charlie@example.com / admin123 (Pending Admin)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
