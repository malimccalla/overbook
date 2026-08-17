-- CreateEnum
CREATE TYPE "member_role" AS ENUM ('OWNER', 'ADMIN', 'AGENT', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "booking_request_status" AS ENUM ('NEEDS_REVIEW', 'DISMISSED', 'INFO_REQUESTED', 'CAPTURED');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('CAPTURED', 'AWAITING_REPLY', 'IN_NEGOTIATION', 'PENCILLED', 'AWAITING_ARTIST', 'AWAITING_PROMOTER', 'CONTRACT_REQUESTED', 'CONTRACT_RECEIVED', 'CONFIRMED', 'LOST');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "clerk_org_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "role" "member_role" NOT NULL DEFAULT 'AGENT',
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "agent_id" TEXT,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],
    "genres" TEXT[],
    "notes" TEXT,
    "nylas_calendar_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connected_inboxes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "user_id" TEXT,
    "nylas_grant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connected_inboxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_emails" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "connected_inbox_id" TEXT NOT NULL,
    "nylas_message_id" TEXT NOT NULL,
    "subject" TEXT,
    "body_text" TEXT NOT NULL,
    "body_html" TEXT,
    "from_email" TEXT,
    "from_name" TEXT,
    "received_at" TIMESTAMP(3) NOT NULL,
    "has_attachments" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_requests" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "artist_id" TEXT,
    "raw_email_id" TEXT,
    "forwarded_by_id" TEXT,
    "assigned_to_id" TEXT,
    "promoter" TEXT,
    "promoter_email" TEXT,
    "venue" TEXT,
    "city" TEXT,
    "country" TEXT,
    "proposed_date" TIMESTAMP(3),
    "proposed_date_raw" TEXT,
    "fee_amount" INTEGER,
    "fee_min" INTEGER,
    "fee_max" INTEGER,
    "fee_is_range" BOOLEAN NOT NULL DEFAULT false,
    "currency_code" TEXT,
    "currency_symbol" TEXT,
    "raw_fee" TEXT,
    "agency_fee_on_top" BOOLEAN,
    "details" JSONB,
    "status" "booking_request_status" NOT NULL DEFAULT 'NEEDS_REVIEW',
    "confidence" DOUBLE PRECISION,
    "missing_fields" TEXT[],
    "conflict_flags" TEXT[],
    "summary" TEXT,
    "notes" TEXT,
    "recommended_next_action" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "booking_request_id" TEXT NOT NULL,
    "promoter" TEXT,
    "venue" TEXT,
    "city" TEXT,
    "country" TEXT,
    "date" TIMESTAMP(3),
    "fee_amount" INTEGER,
    "currency_code" TEXT,
    "currency_symbol" TEXT,
    "agency_fee_on_top" BOOLEAN,
    "status" "booking_status" NOT NULL DEFAULT 'CAPTURED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_org_id_key" ON "organizations"("clerk_org_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_organization_id_user_id_key" ON "memberships"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "artists_organization_id_idx" ON "artists"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "connected_inboxes_nylas_grant_id_key" ON "connected_inboxes"("nylas_grant_id");

-- CreateIndex
CREATE UNIQUE INDEX "connected_inboxes_organization_id_email_key" ON "connected_inboxes"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "raw_emails_nylas_message_id_key" ON "raw_emails"("nylas_message_id");

-- CreateIndex
CREATE INDEX "raw_emails_organization_id_idx" ON "raw_emails"("organization_id");

-- CreateIndex
CREATE INDEX "raw_emails_connected_inbox_id_idx" ON "raw_emails"("connected_inbox_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_requests_raw_email_id_key" ON "booking_requests"("raw_email_id");

-- CreateIndex
CREATE INDEX "booking_requests_organization_id_idx" ON "booking_requests"("organization_id");

-- CreateIndex
CREATE INDEX "booking_requests_artist_id_idx" ON "booking_requests"("artist_id");

-- CreateIndex
CREATE INDEX "booking_requests_status_idx" ON "booking_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_request_id_key" ON "bookings"("booking_request_id");

-- CreateIndex
CREATE INDEX "bookings_organization_id_idx" ON "bookings"("organization_id");

-- CreateIndex
CREATE INDEX "bookings_artist_id_idx" ON "bookings"("artist_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connected_inboxes" ADD CONSTRAINT "connected_inboxes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connected_inboxes" ADD CONSTRAINT "connected_inboxes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_emails" ADD CONSTRAINT "raw_emails_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_emails" ADD CONSTRAINT "raw_emails_connected_inbox_id_fkey" FOREIGN KEY ("connected_inbox_id") REFERENCES "connected_inboxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_raw_email_id_fkey" FOREIGN KEY ("raw_email_id") REFERENCES "raw_emails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_forwarded_by_id_fkey" FOREIGN KEY ("forwarded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "booking_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
