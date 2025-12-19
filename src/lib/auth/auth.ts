import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import authconfig from './authconfig';
import prisma from '@/lib/api/prisma';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const adapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  session: { strategy: 'jwt' },
  ...authconfig,
  providers: [
    ...authconfig.providers,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
  async session({ token, session }) {
    if (session.user && token.id) {
      session.user.id = token.id as string;
    }
    return session;
  },
}

});
