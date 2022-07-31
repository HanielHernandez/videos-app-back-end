import { Injectable } from '@nestjs/common';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationParams, PaginationResponse } from 'src/shared/interfaces';
import { VideosIndexDTO } from './dto/videos.index.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async index(
    userId: number,
    params: PaginationParams,
  ): Promise<PaginationResponse<Video>> {
    // fetch subscriptios of user
    const { publishers } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        publishers: {
          select: {
            publisherId: true,
          },
        },
      },
    });

    const publishersId = publishers.map((publishers) => publishers.publisherId);
    const where = {
      publishedById: {
        in: publishersId,
      },
    };
    const totalItems = await this.prisma.video.count({ where });
    const items = await this.prisma.video.findMany({
      where,
      ...this.getFiltersFromParams(params),
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
      ...(perPage ? { take: perPage } : { take: 10 }),
      orderBy: {
        ...(orderBy
          ? { ...orderBy }
          : {
              createdAt: 'desc',
            }),
      },
    };
  }
}
