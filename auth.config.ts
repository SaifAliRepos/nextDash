import { request } from 'http';
import type { NextAuthConfig } from 'next-auth';
import github from 'next-auth/providers/github';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const url = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = url.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', url));
      }
      return !!auth?.user;
    },
  },

  providers: [github], // Add providers with an empty array for now
} satisfies NextAuthConfig;
