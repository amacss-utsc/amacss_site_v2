import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

// The upgraded storage plugin adds this optional field when S3 is enabled.
// Existing uploads keep using their filename when the object key is null.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql`ALTER TABLE public.media ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql`ALTER TABLE public.media DROP COLUMN IF EXISTS "_objectkey";`,
  )
}
