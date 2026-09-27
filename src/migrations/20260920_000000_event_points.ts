import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events"
      ADD COLUMN "points" numeric NOT NULL DEFAULT 0
      CONSTRAINT "events_points_nonnegative_integer"
        CHECK ("points" >= 0 AND "points" < 'Infinity'::numeric AND "points" = trunc("points"));
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events" DROP COLUMN "points";
  `)
}
