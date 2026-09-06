// @ts-check

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url =
  process.env.DATABASE_URL ??
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}` +
    `@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT ?? 5432}/${process.env.DATABASE_NAME}`;

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.js",
  out: "./server/db/migrations",
  dbCredentials: { url },
});
