import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [PrismaModule, AuthModule, VideosModule],
})
export class AppModule {}
