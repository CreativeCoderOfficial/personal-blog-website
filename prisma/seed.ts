// prisma/seed.ts
import 'dotenv/config' // Load .env file (Crucial for manual run)
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

// 1. Setup the Adapter 
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// 2. Pass the adapter to the client
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Starting seed...")

  const mockUsername = process.env.MOCK_USERNAME;
  const mockPassword = process.env.MOCK_PASSWORD;

  if (!mockUsername || !mockPassword) {
    throw new Error("Missing MOCK_USERNAME or MOCK_PASSWORD in .env file");
  }

  // Now TypeScript knows these are strings
  const hashedPw = await bcrypt.hash(mockPassword, 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: { 
      username: mockUsername, 
      passwordHash: hashedPw 
    },
  });
    
  // Create Category
  const nextCategory = await prisma.category.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js', color: '#000000' }
  })

  // Create Resource Type
  const libraryType = await prisma.resourceType.upsert({
    where: { name: 'Library' },
    update: {},
    create: { name: 'Library' }
  })

  // Create Post
  const existingPost = await prisma.post.findUnique({ where: { slug: 'my-first-guide' }})
  
  if (!existingPost) {
    await prisma.post.create({
      data: {
        title: 'My First Next.js Guide',
        slug: 'my-first-guide',
        summary: 'A deep dive into learning Next.js from scratch.',
        readingTime: 5,
        type: 'BLOG',
        status: 'PUBLISHED',
        categories: { connect: { id: nextCategory.id } },
        resourceType: { connect: { id: libraryType.id } },
        sections: {
          create: [
            { order: 1, title: 'Introduction', content: 'Welcome to the guide!' },
            { order: 2, title: 'Getting Started', content: 'Install Next.js first...' }
          ]
        }
      }
    })
    console.log("Created post: My First Next.js Guide")
  } else {
    console.log("Post already exists.")
  }

  console.log("Seed finished successfully.")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })