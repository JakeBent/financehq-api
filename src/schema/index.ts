import { DateTimeResolver } from 'graphql-scalars';
import { createSchema } from 'graphql-yoga';
import User from './user';

export const typeDefs = `
  type Query {
    allUsers: [User!]!
    me: User!
  }

  type Mutation {
    signupUser(data: UserCreateDTO!): AuthPayload!
    loginUser(data: UserLoginDTO!): AuthPayload!
    updateMe(data: UserUpdateDTO!): User!
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

  input UserLoginDTO {
    email: String!
    password: String!
  }

  input UserUpdateDTO {
    name: String
  }

  type AuthPayload {
    token: String
    user: User
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
