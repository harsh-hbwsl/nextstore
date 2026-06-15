import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { usersStore } from './store';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user in store by email
        const user = usersStore.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (!user) return null;

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return object that gets stored in JWT
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Persist role + id into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role: 'admin' | 'user' }).role;
      }
      return token;
    },
    // Expose role + id on the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',             // Custom login page
    error:  '/login',             // Errors redirect to login
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,   // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
