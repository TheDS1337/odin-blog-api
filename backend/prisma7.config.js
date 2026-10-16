import { loadEnvFile, env } from "node:process";
import { defineConfig } from "prisma/config";

loadEnvFile('../.env');

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});