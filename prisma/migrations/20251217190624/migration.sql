/*
  Warnings:

  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_userId_fkey";

-- DropTable
DROP TABLE "Summary";

-- CreateTable
CREATE TABLE "AI_Response" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "provider" TEXT NOT NULL,
    "responseData" TEXT NOT NULL,
    "prompt" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AI_Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AI_Response" ADD CONSTRAINT "AI_Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
