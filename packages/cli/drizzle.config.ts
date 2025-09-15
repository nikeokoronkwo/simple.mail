import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import source from './src/experimental/sql/source';

export default defineConfig({
  out: './experimental/sql/db',
  schema: './experimental/sql/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: source,
  },
});
