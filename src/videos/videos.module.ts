import { Module } from '@nestjs/common';
import { BelongsToUserGuard } from './guards/belongs-to-user.guard';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
