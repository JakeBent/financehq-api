import moment from 'moment';
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
      cancelRegistration(registrationId: String!): Registration!
      approveRegistration(registrationId: String!): Registration!
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

    cancelRegistration: async (
      _parent,
      args: { registrationId: string },
      context: Context,
    ) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const { registrationId } = args;

      const registration = await context.prisma.registration.findUniqueOrThrow({
        where: {
          attendeeId: context.user.id,
          id: registrationId,
        },
        include: { event: true },
      });

      if (moment(registration.event.startTime).isBefore(moment().add(24, 'hours'))) {
        throw new Error('Event is too soon to cancel');
      }

      return context.prisma.registration.update({
        where: {
          attendeeId: context.user.id,
          id: registrationId,
        },
        data: { status: 'CANCELLED' },
        include: {
          event: true,
          attendee: true,
        },
      });
    },

    approveRegistration: async (
      _parent,
      args: { registrationId: string },
      context: Context,
    ) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      const { registrationId } = args;

      const registration = await context.prisma.registration.findUniqueOrThrow({
        where: {
          id: registrationId,
        },
        include: { event: true },
      });

      if (registration.event.organizerId !== context.user.id) {
        throw new Error('Only the organizer can approve');
      }

      return context.prisma.registration.update({
        where: {
          id: registrationId,
        },
        data: { status: 'APPROVED' },
        include: {
          event: true,
          attendee: true,
        },
      });
    },
  },
};
