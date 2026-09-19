import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "registration_deadline" timestamp(3) with time zone;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events" DROP COLUMN IF EXISTS "registration_deadline";
  `)
}
