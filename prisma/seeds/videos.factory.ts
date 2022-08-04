import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const generateVideo = (userId: number | string) => {
  return {
    publishedById: userId,
    published: true,
    miniature: faker.image.imageUrl(300, 150, 'animals,exports,people'),
    description: faker.lorem.paragraph(1),
    title: faker.random.words(6),
    url: 'https://firebasestorage.googleapis.com/v0/b/firechat-c857f.appspot.com/o/Mark%20Ronson%20-%20Uptown%20Funk%20(Official%20Video)%20ft.%20Bruno%20Mars.mp4?alt=media&token=bf63c4a5-3053-44d5-9551-ba7384cb394b',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createVideos = async (prisma: PrismaClient) => {
  console.log('***** Creating videos *****');
  const users = await prisma.user.findMany();
  const videos = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`***** Creating for user: ${user.name} *****`);
    for (let i = 0; i < 5; i++) {
      videos.push(generateVideo(user.id));
    }
  }

  await prisma.video.createMany({ data: videos });

  console.log('***** Videos created *****');
};
