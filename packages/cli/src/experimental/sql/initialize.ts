import { db } from ".";
import * as schema from "./db/schema"
import {generateSQLiteDrizzleJson, generateSQLiteMigration, pushSchema, pushSQLiteSchema} from 'drizzle-kit/api';

export async function initializeDB() {
    const migration = await generateSQLiteMigration(
        await generateSQLiteDrizzleJson({}),
        await generateSQLiteDrizzleJson(schema, undefined, "snake_case")
    );
    for (const query of migration) {
        db.run(query);
    }
}