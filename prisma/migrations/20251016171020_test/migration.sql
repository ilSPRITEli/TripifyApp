/*
  Warnings:

  - You are about to drop the `trip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_tripId_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_interestId_fkey";

-- DropTable
DROP TABLE "trip";

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "travelers" INTEGER NOT NULL,
    "isTemplate" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION,
    "budget" DECIMAL(12,2) NOT NULL,
    "destinationId" UUID,
    "interestId" UUID,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
