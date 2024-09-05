import bcrypt from 'bcryptjs';
import config from '../config';
import { Context } from '../context';

interface UserCreateDTO {
  email: string
  password: string
  name?: string
}

export default {
  Query: {
    allUsers: (_parent, _args, context: Context) => context.prisma.user.findMany(),
  },
  Mutation: {
    signupUser: (
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

      return context.prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
        },
      });
    },
  },
};
