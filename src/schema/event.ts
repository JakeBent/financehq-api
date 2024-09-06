import { Context } from '../context';

interface EventCreateDTO {
  name: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
  category: string
}

export default {
  TypeDefs: `
    type Query {
      readEvents(category: EventCategory): [Event!]!
    }

    type Mutation {
      createEvent(data: EventCreateDTO!): Event!
    }

    type Event {
      id: String!
      name: String!
      description: String
      location: String
      startTime: DateTime!
      endTime: DateTime!
      organizer: User!
      category: EventCategory!
    }

    input EventCreateDTO {
      name: String!
      description: String
      location: String
      startTime: DateTime!
      endTime: DateTime!
      category: EventCategory!
    }

    enum EventCategory {
      PARTY
      CONVENTION
      SPORTS
      TRADE
      CHARITY
      FESTIVAL
      NETWORK
      LAUNCH
      SEMINAR
      CONCERT
      EXHIBIT
    }
  `,

  Query: {
    readEvents: (_parent, args: { category: string }, context: Context) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const query: { include: Record<any, any>, where?: Record<any, any> } = {
        include: { organizer: true },
      };

      const { category } = args;

      if (category) {
        query.where = { category };
      }

      return context.prisma.event.findMany(query);
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
          category,
        },
      } = args;

      const event = await context.prisma.event.create({
        data: {
          name,
          description,
          location,
          startTime,
          endTime,
          category,
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
