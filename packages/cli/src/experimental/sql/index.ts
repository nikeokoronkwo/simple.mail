import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import source from "./source";

const sqlite = new Database(source);

// You can specify any property from the better-sqlite3 connection options
export const db = drizzle({ client: sqlite });
