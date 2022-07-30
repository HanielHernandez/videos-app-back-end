import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('videos')
export class VideosController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getVideos(@Req() req: Request) {
    console.log(req.user);
    return {
      mesage: 'videos goes here',
    };
  }
}
