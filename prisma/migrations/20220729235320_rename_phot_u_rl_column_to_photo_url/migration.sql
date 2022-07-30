/*
  Warnings:

  - You are about to drop the column `photURL` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "photURL",
ADD COLUMN     "photoURL" TEXT;
