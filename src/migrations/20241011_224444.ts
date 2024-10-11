import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_events_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_event_tag_fk";
  
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "events_id";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "event_tag_id";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "redirects_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "event_tag_id" integer;
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_event_tag_fk" FOREIGN KEY ("event_tag_id") REFERENCES "public"."event_tag"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  `)
}
