import { PrismaClient, User } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';
import config from '../config';

export const APP_SECRET = 'this is my secret';

export async function authenticateUser(
  prisma: PrismaClient,
  request: Request,
): Promise<User | null> {
  const header = request.headers.get(config.jwtHeaderName);

  if (header !== null) {
    const token = header.split(' ')[1];
    const tokenPayload = verify(token, config.jwtSecret) as JwtPayload;

    const { userId } = tokenPayload;
    return prisma.user.findUnique({ where: { id: userId } });
  }

  return null;
}
