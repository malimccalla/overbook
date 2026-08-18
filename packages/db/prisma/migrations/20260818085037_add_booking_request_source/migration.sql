-- CreateEnum
CREATE TYPE "booking_request_source" AS ENUM ('EMAIL', 'MANUAL_PASTE', 'API');

-- AlterTable
ALTER TABLE "booking_requests" ADD COLUMN     "source" "booking_request_source" NOT NULL DEFAULT 'API';
