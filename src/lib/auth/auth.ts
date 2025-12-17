import { PrismaAdapter } from '@auth/prisma-adapter';

import NextAuth from 'next-auth';
import authconfig from './authconfig';
import prisma from '../api/prisma';

const adapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  session: {
    strategy: 'jwt',
  },
  ...authconfig,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
        },
      };
    },
  },
});
