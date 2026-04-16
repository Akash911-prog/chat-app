/*
  Warnings:

  - Added the required column `usernameA` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameB` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('READ', 'RECEIVED', 'SENT');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageStatus" "MessageStatus" NOT NULL DEFAULT 'SENT';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usernameA" TEXT NOT NULL,
ADD COLUMN     "usernameB" TEXT NOT NULL;
