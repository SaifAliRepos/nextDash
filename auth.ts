import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import GitHub from '@auth/core/providers/github';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
    GitHub({
      clientId: '752360fb89a78cd275a7' as string,
      clientSecret: 'ca8804f3c43d3b0a22e17907db036d500b55e128' as string,
    }),
  ],

  // secret: process.env.NEXTAUTH_SECRET,
  // basePath: '/api/auth',
  // session: {
  //   strategy: 'jwt',
  // },
  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     user && (token.user = user);
  //     return token;
  //   },
  //   session: async ({ session, token }) => {
  //     //@ts-ignore
  //     session.user = token.user;
  //     return session;
  //   },
  // },
});
