import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "events" ADD COLUMN "has_referral_codes" boolean DEFAULT false;
  ALTER TABLE "registrations" ADD COLUMN "referral_code" varchar;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "events" DROP COLUMN IF EXISTS "has_referral_codes";
  ALTER TABLE "registrations" DROP COLUMN IF EXISTS "referral_code";`)
}
