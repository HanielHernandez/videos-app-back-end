import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';
const generateUser = async () => {
  const password = await argon.hash('123456');

  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    photoURL: faker.image.avatar(),
  };
};

export const createUsers = async (prisma: PrismaClient) => {
  const users = [];
  for (let i = 0; i < 15; i++) {
    const user = await generateUser();
    users.push(user);
  }
  await prisma.user.createMany({
    data: users,
  });
};
