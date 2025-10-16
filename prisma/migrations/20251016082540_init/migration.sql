/*
  Warnings:

  - You are about to drop the column `latitude` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `destinations` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "destinations" DROP CONSTRAINT "destinations_templateId_fkey";

-- DropForeignKey
ALTER TABLE "destinations" DROP CONSTRAINT "destinations_tripId_fkey";

-- DropIndex
DROP INDEX "destinations_tripId_idx";

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "templateId",
DROP COLUMN "tripId";

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "destinationId" UUID;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "destinationId" UUID;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
