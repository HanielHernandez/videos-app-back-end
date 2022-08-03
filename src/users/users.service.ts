import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number, userId?: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const followers = await this.prisma.subscription.count({
      where: {
        publisherId: user.id,
      },
    });

    let subscribed = null;
    if (userId) {
      subscribed = await this.prisma.subscription.findUnique({
        where: {
          subscriberId_publisherId: {
            subscriberId: userId,
            publisherId: user.id,
          },
        },
      });
    }

    return {
      ...user,
      followers,
      subscribed,
    };
  }

  async follow(publisherId: number, subscriberId: number) {
    const sub = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_publisherId: {
          publisherId,
          subscriberId,
        },
      },
    });

    if (sub) {
      return this.prisma.subscription.delete({
        where: {
          subscriberId_publisherId: {
            publisherId,
            subscriberId,
          },
        },
      });
    } else {
      return this.prisma.subscription.create({
        data: {
          publisherId,
          subscriberId,
        },
      });
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }
}
