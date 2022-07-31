import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/';
import { VideosIndexDTO } from './dto/videos.index.dto';
import { VideosService } from './videos.service';
@Controller('videos')
export class VideosController {
  constructor(private videos: VideosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  index(@Body() body: VideosIndexDTO, @GetUser() user: User) {
    return this.videos.index(user.id, body);
  }
}
