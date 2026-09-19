import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  ALTER TABLE "teams" ADD COLUMN "is_current" boolean DEFAULT false NOT NULL;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
  ALTER TABLE "teams" DROP COLUMN IF EXISTS "is_current";
  `)
}
