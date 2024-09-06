import { PrismaClient } from '@prisma/client';
import Chance from 'chance';
import moment from 'moment';
import { EventCreateDTO } from './event';

const chance = new Chance();
const prisma = new PrismaClient();

const randomCategory = (): string => {
  const categories = [
    'PARTY',
    'CONVENTION',
    'SPORTS',
    'TRADE',
    'CHARITY',
    'FESTIVAL',
    'NETWORK',
    'LAUNCH',
    'SEMINAR',
    'CONCERT',
    'EXHIBIT',
  ];
  return categories[Math.floor(Math.random() * (categories.length - 1))];
};

const createEvent = (): EventCreateDTO => {
  const startTime = moment().add(chance.d20(), 'days');
  const endTime = startTime.clone().add(chance.d8(), 'hours');
  return {
    name: chance.sentence(),
    description: chance.paragraph(),
    location: chance.address(),
    startTime: startTime.toDate(),
    endTime: endTime.toDate(),
    category: randomCategory(),
  };
};

async function main() {
  console.log('Starting seed...');

  let eventsCount = 0;
  const users = await Promise.all(Array.from({ length: 1000 }).map(() => {
    const args = {
      email: chance.email(),
      password: 'asdfasdf',
      name: chance.name(),
      events: {},
    };

    if (Math.random() > 0.5) {
      const events = Array.from({ length: Math.floor(Math.random() * 9) }).map(() => createEvent());
      eventsCount += events.length;
      args.events = {
        create: events,
      };
    }

    return prisma.user.create({
      data: args,
    });
  }));

  console.log(`Created:
     ${users.length} users
     ${eventsCount} events
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
