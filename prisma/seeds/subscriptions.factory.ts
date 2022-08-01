import { PrismaClient, User, Subscription } from '@prisma/client';

export const createSubscriptions = async (prisma: PrismaClient) => {
  console.log('***** Creating subscriptions *****');

  const users = await prisma.user.findMany();

  await Promise.all(
    users.map((user) => {
      return prisma.subscription.createMany({
        data: createSubscriptionsForUser(user.id, users),
      });
    }),
  );
  console.log('***** subscriptions created *****');
};

const createSubscriptionsForUser = (subscriberId: number, users: User[]) => {
  const filteredUsers = users.filter((user) => user.id != subscriberId);
  const usersToSubscribe: Subscription[] = [];
  while (usersToSubscribe.length < 3) {
    const publisher =
      filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
    if (
      usersToSubscribe.find((sub) => sub.publisherId == publisher.id) ==
      undefined
    ) {
      usersToSubscribe.push({
        publisherId: publisher.id,
        subscriberId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  return usersToSubscribe;
};
