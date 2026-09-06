// @ts-check

import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";

import { buildDb } from "./index.js";

// Миграции накатываются штатным мигратором drizzle, а не `drizzle-kit migrate`:
// у CLI отказ выходит кодом 1 без единой строки в stderr, и на старте
// приложения это выглядит так, будто миграции просто не сработали.
const db = buildDb();

await migrate(db, { migrationsFolder: new URL("./migrations", import.meta.url).pathname });

await db.$client.end();

console.log("миграции применены");
