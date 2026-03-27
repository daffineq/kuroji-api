CREATE TABLE "zerochan_login" (
	"id" varchar(255) PRIMARY KEY,
	"z_id" text NOT NULL,
	"z_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expired" boolean DEFAULT false NOT NULL
);
