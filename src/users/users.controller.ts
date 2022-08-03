import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() { id: userId }: User) {
    return this.usersService.findOne(+id, +userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  follow(@Param('id') id: string, @GetUser() user: User) {
    return this.usersService.follow(+id, +user.id);
  }
}
