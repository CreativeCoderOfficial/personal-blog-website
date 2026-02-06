// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient, PostType, PostStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg' // Using the adapter for Prisma 7
import bcrypt from 'bcryptjs'

// 1. Init Prisma with the Adapter 
// We require this new connection so the seed.ts can be run alone
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting fresh seed...")

  // --------------------------------------------------------
  // 1. ADMIN USER
  // -------------------------------------------------------
  const passwordRaw = process.env.MOCK_PASSWORD;
  const usernameRaw = process.env.MOCK_USERNAME;
  
  if (!passwordRaw || !usernameRaw) {
    throw new Error("Missing MOCK_USERNAME or MOCK_PASSWORD in .env file");
  }

  const hashedPw = await bcrypt.hash(passwordRaw, 10)
  
  await prisma.adminUser.upsert({
    where: { username: usernameRaw },
    update: {},
    create: { username: usernameRaw, passwordHash: hashedPw },
  })
  console.log(`👤 Admin created: ${usernameRaw}`)

  // --------------------------------------------------------
  // 2. CATEGORIES
  // --------------------------------------------------------
  // Mapping categories to nice Hex colors
  const categoryData = [
    { name: 'planning', color: '#f97316' },             // Orange
    { name: 'tech', color: '#000000' },                 // Black
    { name: 'health', color: '#22c55e' },               // Green
    { name: 'productivity', color: '#eab308' },         // Yellow
    { name: 'superpowered-learning', color: '#3b82f6' }, // Blue
    { name: 'elevating the mind', color: '#a855f7' }      // Purple
  ]

  // We store the created IDs to connect them to posts later
  const categoryMap: Record<string, number> = {}

  for (const cat of categoryData) {
    const result = await prisma.category.upsert({
      where: { name: cat.name },
      update: { color: cat.color }, // Update color if we change it
      create: cat,
    })
    categoryMap[cat.name] = result.id
  }
  console.log("🏷️  Categories created/updated")

  // --------------------------------------------------------
  // 3. RESOURCE TYPES 
  // --------------------------------------------------------
  const resourceTypeNames = ['App', 'Video', 'Tool', 'E-Book', 'Course']
  const resourceTypeMap: Record<string, number> = {}

  for (const name of resourceTypeNames) {
    const result = await prisma.resourceType.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    resourceTypeMap[name] = result.id
  }
  console.log("📚 Resource Types created")

  // --------------------------------------------------------
  // 3. POSTS (Blogs & Resources)
  // --------------------------------------------------------
  const postsData = [
    {
      slug: 'the-art-of-planning',
      title: 'The Art of Planning Your Week',
      summary: 'Why most productivity systems fail and how to fix them.',
      readingTime: 5,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['planning', 'productivity'], 
      resourceType: null, 
    },
    {
      slug: 'nextjs-15-deep-dive',
      title: 'Next.js 15: What is new?',
      summary: 'Exploring the latest features in the React framework.',
      readingTime: 10,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['tech', 'superpowered-learning'],
      resourceType: null,
    },
    {
      slug: 'meditation-for-coders',
      title: 'Meditation 101 for Developers',
      summary: 'Clear your mind to write better code.',
      readingTime: 7,
      type: PostType.BLOG,
      status: PostStatus.DRAFT, 
      categories: ['training the mind', 'health'],
      resourceType: null,
    },
    {
      slug: 'obsidian-tool',
      title: 'Obsidian.md',
      summary: 'The ultimate second brain tool.',
      readingTime: 0, 
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['productivity', 'tech'],
      resourceType: 'Tool', 
      resourceLink: 'https://obsidian.md',
      resourceRating: 5.0,
    },
    {
      slug: 'learning-how-to-learn',
      title: 'Learning How to Learn',
      summary: 'The famous Coursera course.',
      readingTime: 0,
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['superpowered-learning'],
      resourceType: 'Course',
      resourceLink: 'https://coursera.org/learn/learning-how-to-learn',
      resourceRating: 4.8,
    }
  ]

  for (const p of postsData) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        readingTime: p.readingTime,
        type: p.type,
        status: p.status,
        resourceLink: p.resourceLink,
        resourceRating: p.resourceRating,
        
        categories: { 
          connect: p.categories.map(catName => ({ name: catName })) 
        },
        // shortcut for if else statement, only connect to a resource type if it exists
        resourceType: p.resourceType 
          ? { connect: { name: p.resourceType } } 
          : undefined,
          
        sections: {
            create: [
                { order: 1, title: 'Intro', content: 'Sample content...' }
            ]
        }
      }
    })
  }
  console.log("📝 Posts created")
  console.log("✅ Seed finished successfully.")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })