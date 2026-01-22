import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { findOrCreateUser } from '@/lib/contentstack-users';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email || !user.name) {
          console.error('Missing user email or name');
          return false;
        }

        await findOrCreateUser({
          name: user.name,
          email: user.email,
        });

        return true;
      } catch (error) {
        console.error('Error creating Contentstack user:', error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt',
  },
};
