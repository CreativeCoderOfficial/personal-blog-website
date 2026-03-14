# Personal Blog Website

## Description

This is my personal blog website built with Next.js, featuring a modern, responsive design. I'm using it for as my personal site for `maxxed-out.me` but feel free to use this as a template for your own project!

The site includes:

- **Homepage**: Hero section, about, features, resource showcase, and contact information
- **Blogs**: Collection of blog posts with filtering and search capabilities
- **Resources**: Curated resources with different types and categories
- **About**: Personal information and background
- **Support**: Donation system integrated with Stripe for supporting the creator
- **Admin Panel**: Secure dashboard for managing posts, categories, and content

Some functionalities:
- Rich markdown content rendering & syntax highlighting
- Extensive search & filtering
- Dynamic fetching
- Secure payment options
- An entire Content Management System

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4 with Typography plugin
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe for donation processing
- **Content Rendering**: React Markdown with rehype-highlight for code syntax highlighting
- **Icons**: Lucide React
- **Validation**: Zod
- **Other**: bcryptjs for password hashing, rate limiting

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- Stripe account (for donations)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd personal-blog-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Other optional configs
   ```

4. **Set up the database**:

   - Ensure PostgreSQL is running
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```
   - Seed the database (if available):
     ```bash
     npx prisma db seed
     ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.