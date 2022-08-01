/*
  Warnings:

  - Added the required column `miniature` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "miniature" TEXT NOT NULL;
