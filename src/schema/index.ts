import { DateTimeResolver } from 'graphql-scalars';
import { createSchema } from 'graphql-yoga';
import Event from './event';
import User from './user';

export const typeDefs = `
  scalar DateTime

  type AuthPayload {
    token: String
    user: User
  }

  ${User.TypeDefs}
  ${Event.TypeDefs}
`;

export const resolvers = {
  Query: {
    ...User.Query,
    ...Event.Query,
  },
  Mutation: {
    ...User.Mutation,
    ...Event.Mutation,
  },
  DateTime: DateTimeResolver,
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});
