import { DateTimeResolver } from 'graphql-scalars';
import { createSchema } from 'graphql-yoga';
import Event from './event';
import User from './user';

export const typeDefs = `
  type Query {
    allUsers: [User!]!
    me: User!
    readEvents: [Event!]!
  }

  type Mutation {
    signupUser(data: UserCreateDTO!): AuthPayload!
    loginUser(data: UserLoginDTO!): AuthPayload!
    updateMe(data: UserUpdateDTO!): User!

    createEvent(data: EventCreateDTO!): Event!
  }

  scalar DateTime

  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: String!
    email: String!
    password: String!
    name: String
    events: [Event!]
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

  type Event {
    id: String!
    name: String!
    description: String
    location: String
    startTime: DateTime!
    endTime: DateTime!
    organizer: User!
  }

  input EventCreateDTO {
    name: String!
    description: String
    location: String
    startTime: DateTime!
    endTime: DateTime!
  }
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
