import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { GetUser } from 'src/decorators/';
import { PaginationParams } from 'src/shared/interfaces';
import { UserDecodedData } from 'src/shared/interfaces/Iuser.decoded.data';
import { VideosService } from './videos.service';
@Controller('videos')
export class VideosController {
  constructor(private videos: VideosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  index(
    @Query() queryParams: PaginationParams,
    @GetUser() user: UserDecodedData,
  ) {
    console.log(user);
    return this.videos.index(user.id, queryParams);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  show(@Param() id: string | number) {
    return this.videos.findById(typeof id == 'string' ? Number(id) : id);
  }
}
