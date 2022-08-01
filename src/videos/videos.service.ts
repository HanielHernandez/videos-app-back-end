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
    params: PaginationParams,
  ): Promise<PaginationResponse<Video>> {
    console.log('userID', userId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscribers: true,
      },
    });
    const publishersId = user.subscribers.map(
      (publishers) => publishers.publisherId,
    );

    console.log('Publishers of user ' + userId, publishersId);
    const where = {
      publishedById: {
        in: publishersId,
      },
      AND: {
        published: true,
      },
    };
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
    return this.prisma.video.findFirst({
      where: {
        id: id,
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
}
