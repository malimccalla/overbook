-- DropForeignKey
ALTER TABLE "raw_emails" DROP CONSTRAINT "raw_emails_connected_inbox_id_fkey";

-- AlterTable
ALTER TABLE "booking_requests" ADD COLUMN     "thread_id" TEXT;

-- AlterTable
ALTER TABLE "raw_emails" ADD COLUMN     "thread_id" TEXT,
ADD COLUMN     "to_email" TEXT,
ADD COLUMN     "to_name" TEXT,
ALTER COLUMN "connected_inbox_id" DROP NOT NULL,
ALTER COLUMN "nylas_message_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "raw_emails_thread_id_idx" ON "raw_emails"("thread_id");

-- AddForeignKey
ALTER TABLE "raw_emails" ADD CONSTRAINT "raw_emails_connected_inbox_id_fkey" FOREIGN KEY ("connected_inbox_id") REFERENCES "connected_inboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
