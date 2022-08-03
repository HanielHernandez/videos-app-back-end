-- CreateTable
CREATE TABLE "LikedVideos" (
    "id" SERIAL NOT NULL,
    "likeById" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "LikedVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedVideos" ADD CONSTRAINT "LikedVideos_likeById_fkey" FOREIGN KEY ("likeById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedVideos" ADD CONSTRAINT "LikedVideos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
