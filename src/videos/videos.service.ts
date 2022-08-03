import { Injectable } from '@nestjs/common';
import { LikedVideos, Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationParams, PaginationResponse } from 'src/shared/interfaces';
import { CreateLikeDTO } from './dto/create-like.dto';
import { CreateVideoDTO } from './dto/create-video.dto';
import { UpdateVideoDTO } from './dto/update-video.dto';
import { VideosIndexDTO } from './dto/videos.index.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async index(
    userId: number,
    params: VideosIndexDTO,
  ): Promise<PaginationResponse<Video>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscriberOf: true,
      },
    });

    const where = {
      publishedById: {
        ...(params.userId
          ? {
              equals:
                typeof params.userId == 'string'
                  ? Number(params.userId)
                  : params.userId,
            }
          : {
              ...(params.forUser
                ? {
                    in: user.subscriberOf.map(
                      (subscriberTo) => subscriberTo.publisherId,
                    ),
                  }
                : {}),
            }),
      },
      ...(params.userId != userId && {
        AND: {
          published: true,
        },
      }),
    };

    console.log('GENERATED WHERE', where);
    const totalItems = await this.prisma.video.count({ where });

    const items = await this.prisma.video.findMany({
      where,
      ...this.getFiltersFromParams(params),
      include: {
        publishedBy: true,
      },
    });

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / (params.perPage || 10)),
      ...params,
    };
  }

  getFiltersFromParams({ page, perPage, orderBy }: VideosIndexDTO) {
    return {
      ...(page && page > 0 && perPage
        ? { skip: page ? (page - 1) * perPage : 0 }
        : { skip: 0 }),
      ...(perPage ? { take: Number(perPage) } : { take: 10 }),
      orderBy: {
        ...(orderBy
          ? { ...orderBy }
          : {
              createdAt: 'desc',
            }),
      },
    };
  }

  async findById(id: number, userId?: number) {
    const video = await this.prisma.video.findUnique({
      where: {
        id,
      },
      include: {
        publishedBy: true,
        likes: {
          select: {
            likeById: true,
          },
        },
      },
    });
    let subscribed = null;
    if (userId) {
      subscribed = await this.prisma.subscription.findUnique({
        where: {
          subscriberId_publisherId: {
            subscriberId: userId,
            publisherId: video.publishedById,
          },
        },
      });
    }
    return { ...video, subscribed };
  }

  async update(id: number, data: UpdateVideoDTO) {
    return this.prisma.video.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async create(data: CreateVideoDTO) {
    return this.prisma.video.create({
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.video.delete({
      where: {
        id,
      },
    });
  }

  publish(id: number) {
    return this.prisma.video.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });
  }

  async likeVideo(data: CreateLikeDTO) {
    const video = await this.findById(data.videoId);
    const exist = video.likes.findIndex(
      (like) => like.likeById == data.likeById,
    );
    if (exist > -1) {
      return this.prisma.likedVideos.delete({
        where: {
          likeById_videoId: data,
        },
      });
    } else {
      return this.prisma.likedVideos.create({
        data,
      });
    }
  }
}
