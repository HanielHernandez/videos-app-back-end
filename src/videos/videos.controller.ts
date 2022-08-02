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
import { get } from 'http';
import { GetUser } from 'src/decorators/';
import { PaginationParams } from 'src/shared/interfaces';
import { UserDecodedData } from 'src/shared/interfaces/Iuser.decoded.data';
import { CreateVideoDTO } from './dto/create-video.dto';
import { UpdateVideoDTO } from './dto/update-video.dto';
import { VideosIndexDTO } from './dto/videos.index.dto';
import { BelongsToUserGuard } from './guards/belongs-to-user.guard';
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
  findOne(@Param() { id }: any) {
    return this.videos.findById(typeof id == 'string' ? Number(id) : id);
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
}
