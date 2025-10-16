/*
  Warnings:

  - You are about to drop the column `destinationId` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tripId` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTemplate` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "templates_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "templates_interestId_fkey";

-- DropIndex
DROP INDEX "activities_destinationId_idx";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "destinationId",
ADD COLUMN     "tripId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "rating",
ADD COLUMN     "isTemplate" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "templates";

-- CreateIndex
CREATE INDEX "activities_tripId_idx" ON "activities"("tripId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
