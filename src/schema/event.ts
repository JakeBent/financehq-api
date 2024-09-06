import { Context } from '../context';

export interface EventCreateDTO {
  name: string
  description?: string
  location?: string
  startTime: Date
  endTime: Date
  category: string
  isPrivate: boolean
  maxAttendees?: number
  isCancelled?: boolean
}

export interface EventUpdateDTO {
  eventId: string
  isCancelled: boolean
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
      updateEvent(data: EventUpdateDTO!): Event!
    }

    type Event {
      id: String!
      name: String!
      description: String
      location: String
      startTime: DateTime!
      endTime: DateTime!
      category: EventCategory!
      isPrivate: Boolean!
      maxAttendees: Int
      isCancelled: Boolean!
      organizer: User!
      registrations: [Registration!]
    }

    input EventCreateDTO {
      name: String!
      description: String
      location: String
      startTime: DateTime!
      endTime: DateTime!
      category: EventCategory!
      isPrivate: Boolean!
      maxAttendees: Int
    }

    input EventUpdateDTO {
      eventId: String!
      isCancelled: Boolean!
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
      const query: {
        include: { organizer: boolean },
        where: Record<any, any>,
        take: number,
        skip: number,
      } = {
        where: { isPrivate: false },
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
          isPrivate,
          maxAttendees,
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
          isPrivate,
          maxAttendees,
          isCancelled: false,
          organizerId: context.user.id,
        },
        include: {
          organizer: true,
        },
      });

      return event;
    },

    updateEvent: async (
      _parent,
      args: { data: EventUpdateDTO },
      context: Context,
    ) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const { data: { eventId, isCancelled } } = args;

      const event = await context.prisma.event.update({
        where: {
          id: eventId,
          organizerId: context.user.id,
        },
        data: { isCancelled },
        include: { organizer: true },
      });

      return event;
    },
  },
};
