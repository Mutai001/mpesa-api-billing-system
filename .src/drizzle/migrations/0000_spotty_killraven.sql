CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(15) NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"transaction_id" varchar(100),
	"created_at" timestamp DEFAULT now()
);
