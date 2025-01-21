import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_events_reg_style" AS ENUM('internal', 'external', 'none');
  CREATE TYPE "public"."enum_events_registration_form_type" AS ENUM('short_short', 'short', 'multiline', 'dropdown', 'image');
  CREATE TABLE IF NOT EXISTS "events_registration_form_dropdown_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "events_registration_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_events_registration_form_type",
  	"name" varchar,
  	"fieldid" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "registrations_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_id" varchar NOT NULL,
  	"field_type" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id_id" integer NOT NULL,
  	"user_id_id" integer NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "registrations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "events" ADD COLUMN "reg_style" "enum_events_reg_style";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registrations_id" integer;
  DO $$ BEGIN
   ALTER TABLE "events_registration_form_dropdown_options" ADD CONSTRAINT "events_registration_form_dropdown_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_registration_form"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events_registration_form" ADD CONSTRAINT "events_registration_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrations_answers" ADD CONSTRAINT "registrations_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_id_events_id_fk" FOREIGN KEY ("event_id_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_id_club_member_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "public"."club_member"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrations_rels" ADD CONSTRAINT "registrations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrations_rels" ADD CONSTRAINT "registrations_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_registration_form_dropdown_options_order_idx" ON "events_registration_form_dropdown_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_registration_form_dropdown_options_parent_id_idx" ON "events_registration_form_dropdown_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_registration_form_order_idx" ON "events_registration_form" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_registration_form_parent_id_idx" ON "events_registration_form" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "registrations_answers_order_idx" ON "registrations_answers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "registrations_answers_parent_id_idx" ON "registrations_answers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "registrations_event_id_idx" ON "registrations" USING btree ("event_id_id");
  CREATE INDEX IF NOT EXISTS "registrations_user_id_idx" ON "registrations" USING btree ("user_id_id");
  CREATE INDEX IF NOT EXISTS "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "registrations_rels_order_idx" ON "registrations_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "registrations_rels_parent_idx" ON "registrations_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "registrations_rels_path_idx" ON "registrations_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "registrations_rels_media_id_idx" ON "registrations_rels" USING btree ("media_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "events_registration_form_dropdown_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_registration_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations_answers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_registration_form_dropdown_options" CASCADE;
  DROP TABLE "events_registration_form" CASCADE;
  DROP TABLE "registrations_answers" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "registrations_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registrations_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_registrations_id_idx";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "reg_style";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "registrations_id";
  DROP TYPE "public"."enum_events_reg_style";
  DROP TYPE "public"."enum_events_registration_form_type";`)
}
