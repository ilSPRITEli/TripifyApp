-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "templateId" UUID;

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "budget" DECIMAL(12,2) NOT NULL,
    "interestId" UUID,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
