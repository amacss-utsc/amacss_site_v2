import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_events_registration_form_type" ADD VALUE 'referral';`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "public"."events_registration_form" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_events_registration_form_type";
  CREATE TYPE "public"."enum_events_registration_form_type" AS ENUM('short_short', 'short', 'multiline', 'dropdown', 'image');
  ALTER TABLE "public"."events_registration_form" ALTER COLUMN "type" SET DATA TYPE "public"."enum_events_registration_form_type" USING "type"::"public"."enum_events_registration_form_type";`)
}
