import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationParams, PaginationResponse } from 'src/shared/interfaces';
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

  async findById(id: number) {
    return this.prisma.video.findUnique({
      where: {
        id,
      },
      include: {
        publishedBy: true,
      },
    });
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
}
