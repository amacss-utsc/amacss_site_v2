import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "header" ADD COLUMN "logo_id" integer;
  DO $$ BEGIN
   ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "header_logo_idx" ON "header" USING btree ("logo_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "header" DROP CONSTRAINT "header_logo_id_media_id_fk";
  
  DROP INDEX IF EXISTS "header_logo_idx";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "logo_id";`)
}
