import { PrismaClient } from '@prisma/client';
import { createSubscriptions } from './subscriptions.factory';
import { createUsers } from './user.factory';
import { createVideos } from './videos.factory';

const prisma = new PrismaClient();

const main = async () => {
  // try {
  //   await createUsers(prisma);
  // } catch (e) {
  //   console.error(e);
  // }

  try {
    await createVideos(prisma);
  } catch (e) {
    console.error(e);
  }

  // try {
  //   await createSubscriptions(prisma);
  // } catch (e) {
  //   console.error(e);
  // }

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
