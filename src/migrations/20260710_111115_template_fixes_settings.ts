import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "hero_primary_cta" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "hero_secondary_cta" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "footer_explore_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "footer_studio_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_aside_eyebrow" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_email_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_location_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_response_time_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "home_intro_eyebrow" varchar;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  ALTER TABLE "site_settings" DROP COLUMN "instagram";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_social_links" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  DROP INDEX "site_settings_logo_idx";
  ALTER TABLE "site_settings" ADD COLUMN "instagram" varchar;
  ALTER TABLE "site_settings" DROP COLUMN "hero_primary_cta";
  ALTER TABLE "site_settings" DROP COLUMN "hero_secondary_cta";
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "footer_explore_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_studio_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_aside_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "contact_email_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_location_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_response_time_label";
  ALTER TABLE "site_settings" DROP COLUMN "home_intro_eyebrow";`)
}
