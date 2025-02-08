CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(15) NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"transaction_id" varchar(100) NOT NULL,
	"merchant_request_id" varchar(100) NOT NULL,
	"checkout_request_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id")
);
