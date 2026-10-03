import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
        ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "linkedin" varchar DEFAULT '';
        ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "github" varchar DEFAULT '';
        ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "webpage" varchar DEFAULT '';
        ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "email" varchar DEFAULT '';
        ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "description" text DEFAULT '';
    `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
        ALTER TABLE "team_members" DROP COLUMN IF EXISTS "linkedin";
        ALTER TABLE "team_members" DROP COLUMN IF EXISTS "github";
        ALTER TABLE "team_members" DROP COLUMN IF EXISTS "webpage";
        ALTER TABLE "team_members" DROP COLUMN IF EXISTS "email";
        ALTER TABLE "team_members" DROP COLUMN IF EXISTS "description";
    `)
}
