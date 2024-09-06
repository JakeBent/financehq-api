import { Context } from '../context';

interface EventCreateDTO {
  name: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
}

export default {
  Query: {
    readEvents: (_parent, _args, context: Context) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      return context.prisma.event.findMany({ include: { organizer: true } });
    },
  },
  Mutation: {
    createEvent: async (
      _parent,
      args: { data: EventCreateDTO },
      context: Context,
    ) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const {
        data: {
          name,
          description,
          location,
          startTime,
          endTime,
        },
      } = args;

      const event = await context.prisma.event.create({
        data: {
          name,
          description,
          location,
          startTime,
          endTime,
          organizerId: context.user.id,
        },
        include: {
          organizer: true,
        },
      });

      return event;
    },
  },
};
