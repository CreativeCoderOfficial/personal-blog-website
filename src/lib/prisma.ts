// lib/prisma.ts
// This file creates a classic Prisma Singleton pattern
// it ensures that the app creates only one connection to the database, 
// no matter how many times the code reloads during development.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// global as unknown is a way to tell Typescript that we'll have a property called prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create the adapter using the connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// If a Prisma client already exists in the global object, we use it. If not, we create a brand new one
export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter, 
    log: ["query"], // prints every SQL to the terminal (for development)
  });

// This basically says to reuse the existing connection and not create new ones development
// (as Next.js does because of Hot Module Replacement, for instance when you edit and save code)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;