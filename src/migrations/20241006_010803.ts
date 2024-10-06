import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "teams" ADD COLUMN "year" varchar NOT NULL;
  ALTER TABLE "teams" ADD COLUMN "name_with_year" varchar;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "teams" DROP COLUMN IF EXISTS "year";
  ALTER TABLE "teams" DROP COLUMN IF EXISTS "name_with_year";`)
}
