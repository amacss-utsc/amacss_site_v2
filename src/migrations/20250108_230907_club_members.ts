import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_club_member_roles" AS ENUM('club-member');
  CREATE TABLE IF NOT EXISTS "club_member_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_club_member_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "club_member" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "club_member_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "club_member_id" integer;
  DO $$ BEGIN
   ALTER TABLE "club_member_roles" ADD CONSTRAINT "club_member_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."club_member"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "club_member_roles_order_idx" ON "club_member_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "club_member_roles_parent_idx" ON "club_member_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "club_member_updated_at_idx" ON "club_member" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "club_member_created_at_idx" ON "club_member" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "club_member_email_idx" ON "club_member" USING btree ("email");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_club_member_fk" FOREIGN KEY ("club_member_id") REFERENCES "public"."club_member"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_club_member_fk" FOREIGN KEY ("club_member_id") REFERENCES "public"."club_member"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_club_member_id_idx" ON "payload_locked_documents_rels" USING btree ("club_member_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_club_member_id_idx" ON "payload_preferences_rels" USING btree ("club_member_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "club_member_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "club_member" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "club_member_roles" CASCADE;
  DROP TABLE "club_member" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_club_member_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_club_member_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_club_member_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_club_member_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "club_member_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "club_member_id";
  DROP TYPE "public"."enum_club_member_roles";`)
}
