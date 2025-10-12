-- DropForeignKey
ALTER TABLE "public"."trips" DROP CONSTRAINT "trips_interestId_fkey";

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "interestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
