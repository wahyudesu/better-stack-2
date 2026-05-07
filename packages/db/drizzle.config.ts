import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './digrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});