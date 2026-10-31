import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

// Additive upgrade for Payload 3.92: server-side sessions, password-reset
// throttling, key/value storage, and the S3 object-key field. Existing content,
// member records, Supabase tables, and retired team tables are preserved.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "club_member_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "club_member_sessions" ADD CONSTRAINT "club_member_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."club_member"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");

  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");

  CREATE INDEX "club_member_sessions_order_idx" ON "club_member_sessions" USING btree ("_order");

  CREATE INDEX "club_member_sessions_parent_id_idx" ON "club_member_sessions" USING btree ("_parent_id");

  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");

  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;

  ALTER TABLE "club_member" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;

  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "users_sessions";
    DROP TABLE "club_member_sessions";
    DROP TABLE "payload_kv";
    ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
    ALTER TABLE "club_member" DROP COLUMN "reset_password_requested_at";
    ALTER TABLE "media" DROP COLUMN "_objectkey";
  `)
}
