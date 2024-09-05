import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import config from '../config';
import { Context } from '../context';

interface UserCreateDTO {
  email: string
  password: string
  name?: string
}

interface UserLoginDTO {
  email: string
  password: string
}

export default {
  Query: {
    allUsers: (_parent, _args, context: Context) => context.prisma.user.findMany(),

    me: (_parent, _args, context: Context) => {
      if (context.user === null) {
        throw new Error('Unauthenticated!');
      }

      return context.user;
    },
  },
  Mutation: {
    signupUser: async (
      _parent,
      args: { data: UserCreateDTO },
      context: Context,
    ) => {
      const {
        data: {
          email,
          password,
          name,
        },
      } = args;

      const hashed = bcrypt.hashSync(password, config.salt);

      const user = await context.prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
        },
      });

      const token = sign({ userId: user.id }, config.jwtSecret);

      return { token, user };
    },

    loginUser: async (
      _parent,
      args: { data: UserLoginDTO },
      context: Context,
    ) => {
      const {
        data: {
          email,
          password,
        },
      } = args;

      const user = await context.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error('Invalid email/password');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid email/password');
      }

      const token = sign({ userId: user.id }, config.jwtSecret);

      return { token, user };
    },
  },
};
