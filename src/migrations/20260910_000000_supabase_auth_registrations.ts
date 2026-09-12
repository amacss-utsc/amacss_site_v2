import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "registrations" ALTER COLUMN "user_id_id" DROP NOT NULL;
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "supabase_user_id" varchar;
    CREATE INDEX IF NOT EXISTS "registrations_supabase_user_id_idx"
      ON "registrations" USING btree ("supabase_user_id");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "registrations_supabase_user_id_idx";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "supabase_user_id";
  `)
}
