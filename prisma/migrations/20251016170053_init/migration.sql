/*
  Warnings:

  - You are about to drop the `trips` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_tripId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_interestId_fkey";

-- DropTable
DROP TABLE "trips";

-- CreateTable
CREATE TABLE "trip" (
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

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
