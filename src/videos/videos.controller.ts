import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { BelongsToUserGuard } from './guards/belongs-to-user.guard';
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
    return this.videos.index(user.id, queryParams);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  findOne(@Param() id: string | number) {
    return this.videos.findById(typeof id == 'string' ? Number(id) : id);
  }

  @UseGuards(AuthGuard('jwt'), new BelongsToUserGuard())
  @Put('/:id')
  update(@Param() id: number, @Body() data: UpdateVideoDTO) {
    return this.videos.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  create(@Param() id: number, @Body() data: CreateVideoDTO) {
    return this.videos.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  delete(@Param() id: number) {
    return this.videos.delete(id);
  }
}
