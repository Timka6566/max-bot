-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "maxUserId" TEXT NOT NULL,
    "firstName" TEXT,
    "username" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_maxUserId_key" ON "User"("maxUserId");
