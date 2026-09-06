// @ts-check

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.js";

const connectionString = () =>
  process.env.DATABASE_URL ??
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}` +
    `@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT ?? 5432}/${process.env.DATABASE_NAME}`;

// Схема передаётся клиенту целиком: без неё не работает `db.query`.
export const buildDb = () => drizzle(connectionString(), { schema, casing: "snake_case" });

export { schema };
