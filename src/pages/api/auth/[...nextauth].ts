import NextAuth, { User, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';

async function getHasCompletedSetup(user: User) {
  return await prisma.user
    .findFirst({
      select: { hasCompletedSetup: true },
      where: {
        id: user.id,
      },
    })
    .then((user) => user?.hasCompletedSetup);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.hasCompletedSetup = await getHasCompletedSetup(user);
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
