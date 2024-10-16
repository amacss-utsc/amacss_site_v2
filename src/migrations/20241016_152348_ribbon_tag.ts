import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"event_tag_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "ribbon_tag" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ribbon_tag" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "events" DROP CONSTRAINT "events_ribbon_tag_id_event_tag_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ribbon_tag_id" integer;
  DO $$ BEGIN
   ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_event_tag_fk" FOREIGN KEY ("event_tag_id") REFERENCES "public"."event_tag"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "ribbon_tag_created_at_idx" ON "ribbon_tag" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_ribbon_tag_id_ribbon_tag_id_fk" FOREIGN KEY ("ribbon_tag_id") REFERENCES "public"."ribbon_tag"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ribbon_tag_fk" FOREIGN KEY ("ribbon_tag_id") REFERENCES "public"."ribbon_tag"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  ALTER TABLE "events" DROP COLUMN IF EXISTS "tags";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "events_rels";
  DROP TABLE "ribbon_tag";
  ALTER TABLE "events" DROP CONSTRAINT "events_ribbon_tag_id_ribbon_tag_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ribbon_tag_fk";
  
  ALTER TABLE "events" ADD COLUMN "tags" varchar NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_ribbon_tag_id_event_tag_id_fk" FOREIGN KEY ("ribbon_tag_id") REFERENCES "public"."event_tag"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "ribbon_tag_id";`)
}
