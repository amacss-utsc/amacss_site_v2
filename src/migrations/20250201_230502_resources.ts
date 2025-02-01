import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"button_text" varchar DEFAULT 'Learn More' NOT NULL,
  	"link" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"resource_tag_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "resource_tag" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"resource_tag" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resource_tag_id" integer;
  DO $$ BEGIN
   ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_resource_tag_fk" FOREIGN KEY ("resource_tag_id") REFERENCES "public"."resource_tag"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "resources_rels_resource_tag_id_idx" ON "resources_rels" USING btree ("resource_tag_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "resource_tag_resource_tag_idx" ON "resource_tag" USING btree ("resource_tag");
  CREATE INDEX IF NOT EXISTS "resource_tag_updated_at_idx" ON "resource_tag" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "resource_tag_created_at_idx" ON "resource_tag" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resource_tag_fk" FOREIGN KEY ("resource_tag_id") REFERENCES "public"."resource_tag"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_resource_tag_id_idx" ON "payload_locked_documents_rels" USING btree ("resource_tag_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resource_tag" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "resource_tag" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resource_tag_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_resources_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_resource_tag_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "resource_tag_id";`)
}
