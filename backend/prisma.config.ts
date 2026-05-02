import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Ensure process.env is loaded

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
