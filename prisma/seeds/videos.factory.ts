import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const generateVideo = (userId: number | string) => {
  return {
    publishedById: userId,
    published: true,
    miniature: faker.image.imageUrl(160, 250),
    description: faker.lorem.paragraph(1),
    title: faker.random.words(6),
    url: faker.internet.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createVideos = async (prisma: PrismaClient) => {
  console.log('***** Creating videos *****');
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
  console.log('***** Videos created *****');
};
