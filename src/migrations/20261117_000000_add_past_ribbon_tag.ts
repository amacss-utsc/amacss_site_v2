import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    INSERT INTO "ribbon_tag" ("ribbon_tag")
    SELECT 'PAST'
    WHERE NOT EXISTS (
      SELECT 1 FROM "ribbon_tag" WHERE "ribbon_tag" = 'PAST'
    );
  `)

  await payload.db.drizzle.execute(sql`
    UPDATE "events"
    SET "ribbon_tag_id" = (
      SELECT "id" FROM "ribbon_tag" WHERE "ribbon_tag" = 'PAST' LIMIT 1
    )
    WHERE "date" < (date_trunc('day', now() AT TIME ZONE 'America/Toronto') AT TIME ZONE 'America/Toronto')
      AND (
        "end_date" IS NULL
        OR "end_date" < (date_trunc('day', now() AT TIME ZONE 'America/Toronto') AT TIME ZONE 'America/Toronto')
      )
      AND lower(trim("title")) <> 'fy orientation';
  `)
}

// Keep the tag and event assignments if the migration is rolled back.
export async function down(_args: MigrateDownArgs): Promise<void> {}
