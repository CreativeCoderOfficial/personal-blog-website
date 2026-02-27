// src/app/api/auth/[...nextauth]/route.ts
//
// This file is the HTTP entry point for all NextAuth internals.
// NextAuth needs several endpoints to function, for example:
//   - POST /api/auth/signin     → processes the login form submission
//   - POST /api/auth/signout    → destroys the session
//   - GET  /api/auth/session    → returns the current session to the client
//   - GET  /api/auth/csrf       → provides a CSRF token for form security
//
// Rather than having to write all those routes manually,
// NextAuth generates them automatically from the auth.ts config.
// This file just plugs those generated handlers into Next.js's
// App Router by exporting them as GET and POST.

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;