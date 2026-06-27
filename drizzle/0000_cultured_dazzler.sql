CREATE TYPE "public"."donation_status" AS ENUM('pending_validation', 'accepted', 'pending_match', 'assigned', 'in_progress', 'ready_to_deploy', 'unrepairable');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('donor', 'technician', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('pending_approval', 'active');--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donor_id" uuid NOT NULL,
	"technician_id" uuid,
	"status" "donation_status" DEFAULT 'pending_validation' NOT NULL,
	"hardware_details" jsonb,
	"photos" text[],
	"location" geometry(point)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"status" "user_status" DEFAULT 'pending_approval' NOT NULL,
	"location" geometry(point),
	"max_capacity" integer DEFAULT 0,
	"current_load" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_users_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;