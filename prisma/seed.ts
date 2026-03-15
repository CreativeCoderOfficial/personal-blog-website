// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient, PostType, PostStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting detailed seed...")

  // --------------------------------------------------------
  // 1. ADMIN USER
  // --------------------------------------------------------
  const passwordRaw = process.env.ADMIN_PASSWORD;
  const usernameRaw = process.env.ADMIN_USERNAME;

  if (!passwordRaw || !usernameRaw) {
    throw new Error("CRITICAL: Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env");
  }

  const hashedPw = await bcrypt.hash(passwordRaw, 10)
  
  await prisma.adminUser.upsert({
    where: { username: usernameRaw },
    update: {},
    create: { username: usernameRaw, passwordHash: hashedPw },
  })

  // --------------------------------------------------------
  // 2. CATEGORIES
  // --------------------------------------------------------
  const categoryData = [
    { name: 'planning', color: '#f97316' },             // Orange
    { name: 'tech', color: '#000000' },                 // Black
    { name: 'health', color: '#22c55e' },               // Green
    { name: 'productivity', color: '#eab308' },         // Yellow
    { name: 'superpowered-learning', color: '#3b82f6' }, // Blue
    { name: 'elevating the mind', color: '#a855f7' }     // Purple
  ]

  for (const cat of categoryData) {
    // Make sure everything in lower case to avoid "tech" & "Tech" both stored in the DB
    const normalizedName = cat.name.toLowerCase();
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { color: cat.color },
      create: cat,
    })
  }

  // --------------------------------------------------------
  // 3. RESOURCE TYPES 
  // --------------------------------------------------------
  const resourceTypeNames = ['App', 'Video', 'Tool', 'E-Book', 'Course']
  for (const name of resourceTypeNames) {
    const normalizedResourceName = name.toLowerCase();
    await prisma.resourceType.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // --------------------------------------------------------
  // 4. CONTENT HELPERS
  // --------------------------------------------------------

  // Helper 1: Extensive PLAIN TEXT content
  const extensiveTextSections = [
    {
      order: 1,
      title: "The Foundation of the System",
      content: "To understand why this system works, we must first look at the psychology of attention. Most people plan their weeks based on time slots, but this is a fundamental error. Energy management is far more critical than time management. When we allocate tasks to specific hours without regarding our mental state, we set ourselves up for failure. This section explores the three pillars of sustainable planning: Prioritization, Energy Mapping, and Buffers. Without these, any schedule is destined to crumble under the weight of unexpected interruptions."
    },
    {
      order: 2,
      title: "Execution Strategies",
      content: "Once the plan is in place, execution becomes the next hurdle. The '2-Minute Rule' is often cited, but for deep work, we need something more robust. I recommend the '90-Minute Cycle'. Research suggests that the human brain can only maintain high-focus intensity for about 90 minutes before requiring a reset. By structuring your day into these blocks, separated by 20-minute active recovery periods, you maintain a higher average output throughout the day compared to the standard 9-to-5 marathon approach."
    }
  ];

  // Helper 2: EXTRAVAGANT MARKDOWN content
  const extravagantMarkdownSections = [
    {
      order: 1,
      title: "Typography Showcase",
      content: `
## The Power of Markdown
This section exists to **stress test** your typography styles. We need to ensure that _italics_, **bold text**, and even ~~strikethrough text~~ look perfect.

### Nested Lists
Lists are crucial for clarity. Here is how we handle complexity:
1. **Frontend Layer**
   - React 19
   - Tailwind CSS
   - _Framer Motion_
2. **Backend Layer**
   - PostgreSQL
   - Prisma ORM
     - Schema validation
     - Migrations

### Blockquotes
Sometimes we need to quote wisdom:
> "Premature optimization is the root of all evil."
> — *Donald Knuth*

---
`
    },
    {
      order: 2,
      title: "Code & Technical Details",
      content: `
### Syntax Highlighting
We need to support multiple languages.

**TypeScript:**
\`\`\`typescript
interface User {
  id: number;
  name: string;
  role: 'ADMIN' | 'USER';
}

const getUser = (id: number): User => {
  return { id, name: "Max", role: "ADMIN" };
}
\`\`\`

**CSS / Tailwind:**
\`\`\`css
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
\`\`\`

### Tables (If supported by your renderer)
| Feature | Status | Priority |
| :--- | :---: | ---: |
| Dark Mode | ✅ Ready | High |
| Search | 🚧 WIP | Medium |
| Auth | ❌ Pending | Low |

Using \`inline code\` is also very common for mentioning variables like \`process.env.DATABASE_URL\`.
`
    }
  ];

  // --------------------------------------------------------
  // 5. POSTS DATA
  // --------------------------------------------------------
  const postsData = [
    // --- BLOGS (8 Items) ---
    {
      slug: 'the-art-of-planning',
      title: 'The Art of Planning Your Week',
      summary: 'Why most productivity systems fail and how to fix them.',
      readingTime: 5,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['planning', 'productivity'], 
      thumbnailUrl: 'https://picsum.photos/seed/planning123/800/600',
      keyTakeaways: [
        "Stop managing time, start managing energy.",
        "Use the 90-minute cycle for deep work.",
        "Always leave 20% buffer time for emergencies."
      ],
      sections: extensiveTextSections 
    },
    {
      slug: 'nextjs-15-deep-dive',
      title: 'Next.js 15: Deep Dive',
      summary: 'Exploring the latest features in the React framework.',
      readingTime: 12, // Longer read
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['tech', 'superpowered-learning'],
      thumbnailUrl: 'https://picsum.photos/seed/nextjs/800/600',
      keyTakeaways: [
        "Server Actions replace API routes for mutations.",
        "Turbopack is 700x faster than Webpack.",
        "Partial Prerendering is the future of hybrid apps."
      ],
      sections: extravagantMarkdownSections // <--- RICH MARKDOWN
    },
    {
      slug: 'meditation-for-coders',
      title: 'Meditation 101 for Developers',
      summary: 'Clear your mind to write better code.',
      readingTime: 7,
      type: PostType.BLOG,
      status: PostStatus.DRAFT, 
      categories: ['elevating the mind', 'health'],
      thumbnailUrl: 'https://picsum.photos/seed/meditate/800/600',
      keyTakeaways: [],
    },
    {
      slug: 'deep-work-strategies',
      title: 'Strategies for Deep Work',
      summary: 'How to maintain focus in a world of distractions.',
      readingTime: 8,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['productivity', 'superpowered-learning'],
      thumbnailUrl: 'https://picsum.photos/seed/deepwork/800/600',
      keyTakeaways: [
        "Turn off all notifications.",
        "Work in a dedicated space.",
        "Define 'Done' before you start."
      ],
    },
    {
      slug: 'why-tailwind-wins',
      title: 'Why Tailwind CSS Wins',
      summary: 'A look at utility-first CSS and developer velocity.',
      readingTime: 6,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['tech'],
      thumbnailUrl: 'https://picsum.photos/seed/css/800/600',
      keyTakeaways: [
        "You stop naming things.",
        "Your CSS stops growing linearly.",
        "It's safer to change."
      ],
    },
    {
      slug: 'sleep-as-a-tool',
      title: 'Sleep: The Underrated Developer Tool',
      summary: 'Optimizing recovery for better problem solving.',
      readingTime: 9,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['health', 'productivity'],
      thumbnailUrl: 'https://picsum.photos/seed/sleep/800/600',
      keyTakeaways: [
        "Sleep is when memory consolidation happens.",
        "Lack of sleep reduces problem-solving by 40%.",
        "Consistency > Duration."
      ],
    },
    {
      slug: 'stoicism-in-tech',
      title: 'Stoicism in Software Engineering',
      summary: 'Handling bugs and outages with a calm mind.',
      readingTime: 12,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['elevating the mind'],
      thumbnailUrl: 'https://picsum.photos/seed/stoic/800/600',
      keyTakeaways: [
        "Control what you can control.",
        "Accept the bug exists, then fix it.",
        "The obstacle is the way."
      ],
    },
    {
      slug: 'building-second-brain',
      title: 'Building a Second Brain',
      summary: 'Organizing your digital life for maximum creativity.',
      readingTime: 15,
      type: PostType.BLOG,
      status: PostStatus.PUBLISHED,
      categories: ['productivity', 'planning'],
      thumbnailUrl: 'https://picsum.photos/seed/brain/800/600',
      keyTakeaways: [
        "CODE: Capture, Organize, Distill, Express.",
        "Your brain is for having ideas, not holding them.",
        "Projects over Categories."
      ],
    },

    // --- RESOURCES (8 Items) ---
    // Note: Resources now have readingTime (e.g. video length, course hours, etc.)
    {
      slug: 'obsidian-tool',
      title: 'Obsidian.md',
      summary: 'The ultimate second brain tool.',
      readingTime: 15, // Time to set up / learn basics
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['productivity', 'tech'],
      resourceType: 'Tool', 
      resourceLink: 'https://obsidian.md',
      resourceRating: 5.0,
      thumbnailUrl: 'https://picsum.photos/seed/obsidian/800/600',
      keyTakeaways: [
        "Local-first markdown files.",
        "Graph view connects your thoughts.",
        "Infinite plugin ecosystem."
      ],
      sections: extensiveTextSections
    },
    {
      slug: 'learning-how-to-learn',
      title: 'Learning How to Learn',
      summary: 'The famous Coursera course.',
      readingTime: 600, // ~10 hours course
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['superpowered-learning'],
      resourceType: 'Course',
      resourceLink: 'https://coursera.org/learn/learning-how-to-learn',
      resourceRating: 4.8,
      thumbnailUrl: 'https://covers.openlibrary.org/b/isbn/9780143132547-L.jpg', 
      keyTakeaways: [
        "Focused vs Diffuse modes of thinking.",
        "Spaced repetition is key.",
        "Procrastination is a pain response."
      ],
      sections: extravagantMarkdownSections // <--- RICH MARKDOWN (Resource)
    },
    {
      slug: 'refactoring-ui',
      title: 'Refactoring UI',
      summary: 'The definitive guide to designing beautiful UIs.',
      readingTime: 240, // ~4 hours to read
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['tech'],
      resourceType: 'E-Book',
      resourceLink: 'https://www.refactoringui.com/',
      resourceRating: 4.9,
      thumbnailUrl: 'https://picsum.photos/seed/uiux/800/600',
      keyTakeaways: [
        "Start with too much whitespace.",
        "Use fewer borders.",
        "Think in components."
      ],
    },
    {
      slug: 'vercel-platform',
      title: 'Vercel Platform',
      summary: 'Deploy your Next.js apps with zero configuration.',
      readingTime: 10, // Time to deploy "Hello World"
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['tech', 'planning'],
      resourceType: 'App',
      resourceLink: 'https://vercel.com',
      resourceRating: 4.7,
      thumbnailUrl: 'https://picsum.photos/seed/vercel/800/600',
      keyTakeaways: [],
    },
    {
      slug: 'huberman-lab-focus',
      title: 'Huberman Lab: Focus Toolkit',
      summary: 'Neuroscience-based tools to improve concentration.',
      readingTime: 90, // 1.5 hour episode
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['health', 'superpowered-learning'],
      resourceType: 'Video',
      resourceLink: 'https://youtube.com/...',
      resourceRating: 5.0,
      thumbnailUrl: 'https://picsum.photos/seed/neuro/800/600',
      keyTakeaways: [
        "View morning sunlight.",
        "Wait 90 mins before caffeine.",
        "Use NSDR for recovery."
      ],
    },
    {
      slug: 'notion-app',
      title: 'Notion',
      summary: 'All-in-one workspace for notes and tasks.',
      readingTime: 20, // Setup time
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['planning', 'productivity'],
      resourceType: 'App',
      resourceLink: 'https://notion.so',
      resourceRating: 4.5,
      thumbnailUrl: 'https://picsum.photos/seed/notion/800/600',
      keyTakeaways: [],
    },
    {
      slug: 'total-typescript',
      title: 'Total TypeScript',
      summary: 'Comprehensive mastery of TypeScript.',
      readingTime: 480, // ~8 hours
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['tech', 'superpowered-learning'],
      resourceType: 'Course',
      resourceLink: 'https://totaltypescript.com',
      resourceRating: 5.0,
      thumbnailUrl: 'https://picsum.photos/seed/typescript/800/600',
      keyTakeaways: [
        "Type narrowing.",
        "Generics are just function arguments for types.",
        "Zod integration."
      ],
    },
    {
      slug: 'figma-design',
      title: 'Figma',
      summary: 'The collaborative interface design tool.',
      readingTime: 15,
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
      categories: ['tech'],
      resourceType: 'Tool',
      resourceLink: 'https://figma.com',
      resourceRating: 4.8,
      thumbnailUrl: 'https://picsum.photos/seed/figma/800/600',
      keyTakeaways: [],
    }
  ]

  for (const p of postsData) {
    const postSections = p.sections || [
      { order: 1, title: 'Introduction', content: 'This is a standard placeholder section for cards that do not have extensive detail.' }
    ];

    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        // Update fields if we re-run seed
        keyTakeaways: p.keyTakeaways,
        readingTime: p.readingTime,
        thumbnailUrl: p.thumbnailUrl,
        summary: p.summary,
        title: p.title
      },
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        readingTime: p.readingTime,
        type: p.type,
        status: p.status,
        resourceLink: p.resourceLink,
        resourceRating: p.resourceRating,
        thumbnailUrl: p.thumbnailUrl,
        keyTakeaways: p.keyTakeaways, // <--- Added Key Takeaways
        
        categories: { 
          connect: p.categories.map(catName => ({ name: catName })) 
        },
        resourceType: p.resourceType 
          ? { connect: { name: p.resourceType } } 
          : undefined,
          
        sections: {
            create: postSections
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