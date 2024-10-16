import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "dashboard_item" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"background_image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "dashboard" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "dashboard_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dashboard_item_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dashboard_item_id" integer;
  DO $$ BEGIN
   ALTER TABLE "dashboard_item" ADD CONSTRAINT "dashboard_item_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "dashboard" ADD CONSTRAINT "dashboard_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "dashboard_rels" ADD CONSTRAINT "dashboard_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dashboard"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "dashboard_rels" ADD CONSTRAINT "dashboard_rels_dashboard_item_fk" FOREIGN KEY ("dashboard_item_id") REFERENCES "public"."dashboard_item"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "dashboard_item_created_at_idx" ON "dashboard_item" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "dashboard_rels_order_idx" ON "dashboard_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "dashboard_rels_parent_idx" ON "dashboard_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "dashboard_rels_path_idx" ON "dashboard_rels" USING btree ("path");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dashboard_item_fk" FOREIGN KEY ("dashboard_item_id") REFERENCES "public"."dashboard_item"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "dashboard_item";
  DROP TABLE "dashboard";
  DROP TABLE "dashboard_rels";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_dashboard_item_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "dashboard_item_id";`)
}
