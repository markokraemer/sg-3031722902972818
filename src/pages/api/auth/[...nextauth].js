import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

let prisma;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  prisma = null;
}

export default NextAuth({
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!prisma) {
          throw new Error('Database connection failed');
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { id: user.id, name: user.name, email: user.email };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
});