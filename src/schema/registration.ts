import { Context } from '../context';

export interface RegistrationCreateDTO {
  eventId: string
}

export default {
  TypeDefs: `
    type Query {
      readRegistrations: [Registration!]!
    }

    type Mutation {
      createRegistration(data: RegistrationCreateDTO!): Registration!
    }

    type Registration {
      id: String!
      status: RegistrationStatus!
      attendee: User!
      event: Event!
    }

    input RegistrationCreateDTO {
      eventId: String!
    }

    enum RegistrationStatus {
      APPROVED
      PENDING
      REJECTED
      CANCELLED
    }
  `,

  Query: {
    readRegistrations: (_parent, _args, context: Context) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      return context.prisma.registration.findMany({
        where: { attendeeId: context.user.id },
        include: { attendee: true, event: true },
      });
    },
  },

  Mutation: {
    createRegistration: async (
      _parent,
      args: { data: RegistrationCreateDTO },
      context: Context,
    ) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const {
        data: { eventId },
      } = args;

      const event = await context.prisma.event.findUniqueOrThrow({
        where: { id: eventId },
        include: {
          registrations: {
            where: {
              status: 'APPROVED',
            },
          },
        },
      });

      let status = 'APPROVED';
      if (event.isPrivate
        || (event.maxAttendees && event.maxAttendees <= event.registrations.length)
      ) {
        status = 'PENDING';
      }

      return context.prisma.registration.create({
        data: {
          status,
          attendeeId: context.user.id,
          eventId,
        },
        include: {
          event: true,
          attendee: true,
        },
      });
    },
  },
};
