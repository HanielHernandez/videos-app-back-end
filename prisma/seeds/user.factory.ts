import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const generateUser = () => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '123456',
    photoURL: faker.image.avatar(),
  };
};

export const createUsers = async (prisma: PrismaClient) => {
  const users = [];
  for (let i = 0; i < 15; i++) {
    users.push(generateUser());
  }
  await prisma.user.createMany({
    data: users,
  });
};
