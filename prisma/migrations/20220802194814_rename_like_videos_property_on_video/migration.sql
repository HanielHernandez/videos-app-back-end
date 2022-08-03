/*
  Warnings:

  - The primary key for the `LikedVideos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikedVideos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LikedVideos" DROP CONSTRAINT "LikedVideos_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikedVideos_pkey" PRIMARY KEY ("likeById", "videoId");
