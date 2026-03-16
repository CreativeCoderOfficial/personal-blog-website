// src/lib/auth.ts
//
// This is the central NextAuth configuration file.
// It defines HOW authentication works in this app:
//   - Which login method(s) are allowed
//   - How to validate credentials against the database
//   - How to store the session after login
//   - Where to redirect unauthenticated users
//
// We export four things from NextAuth() that the rest of the app uses:
//   - handlers → wired to the /api/auth/* route (Step 4)
//   - auth      → call this anywhere to get the current session
//   - signIn    → call this to trigger login
//   - signOut   → call this to destroy the session

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({

  trustHost: true, // Required in v5 — tells Auth.js to trust the incoming host header

  providers: [
    // "Providers" tell NextAuth what login methods are available
    // We only use credentials (username + password) (and not things like Google or GitHub OAuth)
    Credentials({
      // These just label the fields — NextAuth doesn't use them directly (they're displayed for UI)
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize() is the core function. It runs on the server only,
      // It receives whatever the login form submits,
      // checks it against the database, and either:
      //   - returns a user object → login succeeds
      //   - returns null          → login fails (NextAuth shows a generic error)
      async authorize(credentials) {
        
        // Reject immediately if either field is missing
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Look up the admin by username in the database
        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username as string },
        });
        
        // If no user found, reject
        if (!user) return null;

        // bcrypt.compare() hashes the submitted password the same way
        // and checks if it matches the stored hash
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        // Wrong password → reject
        if (!isValid) return null;

        // Success → return a minimal user object
        // This gets encoded into the JWT token
        return {
          id: String(user.id),
          name: user.username,
        };
      },
    }),
  ],

  pages: {
    // Tell NextAuth where our custom login page lives.
    signIn: "/login",
  },

  session: {
    // How the session is stored after login
    // We're using JSON Web Token
    // This is a good way for our use case while avoiding db look-ups 
    // (like with regular session tokens)
    strategy: "jwt",
  },
});