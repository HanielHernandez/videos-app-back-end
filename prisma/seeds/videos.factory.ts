import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const generateVideo = (userId: any) => {
  return {
    publishedBy: userId,
    published: true,
    description: faker.lorem.paragraph(1),
    title: faker.commerce.productName(),
    url: faker.internet.url(),
  };
};

export const createUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();

  await Promise.all(
    users.map((user) => {
      const videos = [];
      for (let i = 0; i < 5; i++) {
        videos.push(generateVideo(user.id));
      }
      return prisma.video.createMany({ data: videos });
    }),
  );
};
