import { PrismaClient } from '@prisma/client';
import { createUsers } from './user.factory';

const prisma = new PrismaClient();

const main = async () => {
  try {
    await createUsers(prisma);
  } catch (e) {
    console.error(e);
  }
  console.log('***** DATABASE SEEDEED SUCCESSFULLY ******');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
    process.exit();
  });
