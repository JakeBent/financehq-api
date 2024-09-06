import { Context } from '../context';

export interface EventCreateDTO {
  name: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
  category: string
}

export interface EventReadQuery {
  name?: string
  category?: string
  take?: number
  skip?: number
}

export default {
  TypeDefs: `
    type Query {
      readEvents(query: EventReadQuery): [Event!]!
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

    input EventReadQuery {
      category: EventCategory
      name: String
      take: Int
      skip: Int
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
    readEvents: (_parent, args: { query: EventReadQuery }, context: Context) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const query: {
        include: { organizer: boolean },
        where: {
          category?: string,
          name?: { contains: string },
        },
        take: number,
        skip: number,
      } = {
        where: {},
        include: { organizer: true },
        take: args?.query?.take ?? 20,
        skip: args?.query?.skip ?? 0,
      };

      if (args?.query?.category) {
        query.where.category = args.query.category;
      }

      if (args?.query?.name) {
        query.where.name = { contains: args.query.name };
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
