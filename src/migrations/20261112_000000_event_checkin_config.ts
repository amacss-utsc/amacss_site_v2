import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Payload serves public event data through its own access rules. Block direct
  // Data API reads in the same database before adding the private code column.
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
  `)

  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events"
      ADD COLUMN "check_in_opens_at" timestamp(3) with time zone,
      ADD COLUMN "check_in_closes_at" timestamp(3) with time zone,
      ADD COLUMN "attendance_code" varchar,
      ADD CONSTRAINT "events_check_in_window_valid"
        CHECK (
          ("check_in_opens_at" IS NULL AND "check_in_closes_at" IS NULL)
          OR (
            "check_in_opens_at" IS NOT NULL
            AND "check_in_closes_at" IS NOT NULL
            AND "check_in_opens_at" < "check_in_closes_at"
          )
        ),
      ADD CONSTRAINT "events_attendance_code_valid"
        CHECK ("attendance_code" IS NULL OR "attendance_code" ~ '^[A-Za-z0-9_-]{32}$'),
      ADD CONSTRAINT "events_attendance_code_unique" UNIQUE ("attendance_code");
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "events"
      DROP COLUMN "check_in_opens_at",
      DROP COLUMN "check_in_closes_at",
      DROP COLUMN "attendance_code";
  `)

  // Keep RLS enabled on rollback. A later policy may rely on it, and removing
  // these columns does not justify reopening direct Data API reads.
}
