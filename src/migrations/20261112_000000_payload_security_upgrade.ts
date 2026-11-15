import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

// Schema additions required by the Payload security upgrade.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, parent] of [
    ["users_sessions", "users"],
    ["club_member_sessions", "club_member"],
  ]) {
    await db.execute(
      sql.raw(`
      ALTER TABLE "${parent}" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
      CREATE TABLE IF NOT EXISTS "${table}" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL REFERENCES "${parent}"("id") ON DELETE CASCADE,
        "id" varchar PRIMARY KEY NOT NULL,
        "created_at" timestamp(3) with time zone,
        "expires_at" timestamp(3) with time zone NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "${table}_order_idx" ON "${table}" ("_order");
      CREATE INDEX IF NOT EXISTS "${table}_parent_id_idx" ON "${table}" ("_parent_id");
    `),
    )
  }
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" ("key");
  `)
  // Supabase's Data API must not bypass Payload's server-side access controls.
  // Payload connects as the database owner; no browser-facing policies are needed.
  await db.execute(sql`
    DO $$
    DECLARE table_name text; api_role text;
    BEGIN
      FOREACH table_name IN ARRAY ARRAY[
        'users', 'users_sessions', 'club_member', 'club_member_roles',
        'club_member_sessions', 'registrations', 'registrations_answers',
        'payload_migrations', 'payload_kv', 'payload_preferences', 'payload_preferences_rels',
        'payload_locked_documents', 'payload_locked_documents_rels'
      ] LOOP
        IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
          EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
          FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
              EXECUTE format('REVOKE ALL ON TABLE public.%I FROM %I', table_name, api_role);
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "users_sessions", "club_member_sessions", "payload_kv";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
    ALTER TABLE "club_member" DROP COLUMN IF EXISTS "reset_password_requested_at";`)
}
