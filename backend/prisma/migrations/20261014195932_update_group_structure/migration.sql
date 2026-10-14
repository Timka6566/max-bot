/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "specialtyCode" TEXT NOT NULL,
    "specialtyName" TEXT,
    "groupNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_fullName_key" ON "Group"("fullName");
