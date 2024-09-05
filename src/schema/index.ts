import { DateTimeResolver } from 'graphql-scalars';
import { createSchema } from 'graphql-yoga';
import User from './user';

export const typeDefs = `
  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    signupUser(data: UserCreateDTO!): User!
  }

  type User {
    id: Int!
    email: String!
    password: String!
    name: String
  }

  input UserCreateDTO {
    email: String!
    password: String!
    name: String
  }

  scalar DateTime
`;

export const resolvers = {
  Query: {
    ...User.Query,
  },
  Mutation: {
    ...User.Mutation,
  },
  DateTime: DateTimeResolver,
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});
