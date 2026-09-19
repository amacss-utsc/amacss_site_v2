import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "email" varchar;
    CREATE INDEX IF NOT EXISTS "registrations_email_idx"
      ON "registrations" USING btree ("email");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "registrations_email_idx";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "email";
  `)
}
