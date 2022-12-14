import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/';
import { UserDecodedData } from 'src/shared/interfaces/Iuser.decoded.data';
import { CreateVideoDTO } from './dto/create-video.dto';
import { UpdateVideoDTO } from './dto/update-video.dto';
import { VideosIndexDTO } from './dto/videos.index.dto';
import { VideosService } from './videos.service';
@Controller('videos')
export class VideosController {
  constructor(private videos: VideosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  index(
    @Query() queryParams: VideosIndexDTO,
    @GetUser() user: UserDecodedData,
  ) {
    return this.videos.index(user.id, queryParams);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  findOne(@Param() { id }: any, @GetUser() user: User) {
    return this.videos.findById(+id, +user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  update(@Param('id') id: string, @Body() data: UpdateVideoDTO) {
    return this.videos.update(Number.parseInt(id), data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: CreateVideoDTO) {
    return this.videos.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.videos.delete(Number.parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.videos.publish(Number.parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  like(@GetUser() user: UserDecodedData, @Param('id') id: string) {
    return this.videos.likeVideo({
      likeById: +user.id,
      videoId: +id,
    });
  }
}
