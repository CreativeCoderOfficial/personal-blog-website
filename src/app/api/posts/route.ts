// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Importing the singleton we created
import { PostType, PostStatus } from "@prisma/client"; // Type-safe Enums from Prisma
import { auth } from "@/lib/auth";


/**
 * GET request endpoint for fetching posts
 * @param request contains all relevant parameters to filter on, most importantly:
 * - postType: is it a BLOG, RESOURCE...
 * - page & limit: to understand which subset of posts need to be fetched 
 * (for dynamic rendering, since fetching everything in one go would be very inefficient)
 * @returns the list of filtered posts (including linked data like categories)
 */
export async function GET(request: Request) {
  try {
    // 1. Parse the URL to get "Search Params" (e.g., ?page=1&search=nextjs)
    const { searchParams } = new URL(request.url);
    
    // --- Type param ---
    const typeParam = searchParams.get("type")?.toUpperCase();
    // "ALL" means no type restriction. 
    // If it's missing or invalid, we default to 'BLOG'
    const isAll = typeParam === "ALL";
    const isValidType = typeParam && Object.keys(PostType).includes(typeParam);
    let postType: PostType | null;

    if (isAll) {
      // No type restriction — fetch both blogs and resources
      postType = null;
    } else if (isValidType) {
      // A specific valid type was requested
      postType = typeParam as PostType;
    } else {
      // Missing or unrecognised type — default to BLOG
      postType = PostType.BLOG;
    }

    // --- Status param ---
    // support "ALL" statuses (drafts included), gated by auth
    const statusParam = searchParams.get("status")?.toUpperCase();
    const requestingAll = statusParam === "ALL";

    if (requestingAll) {
      // Only admins should be able to request drafts
      // We check the session here independently of proxy.ts because
      // this is a public-facing API route that anyone can call directly.
      const session = await auth();
      if (!session) {
        // A response gets sent back and we stop executing
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // If not requesting all, always default to PUBLISHED
    const statusFilter = requestingAll ? null : PostStatus.PUBLISHED;



    // Calculating specific result set slice
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    // If we are on page 1, we skip 0. If page 2, we skip the first 6, etc...
    const skip = (page - 1) * limit;

    // Search filters:
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("categories"); // e.g., "tech,productivity"
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    // Variable params:
    const resourceTypeParam = searchParams.get("resourceType"); // for resources


    // 3. Build the Database Query Filters (The "Where" Clause)
    const whereClause: any = {};

     // Only add type filter if a specific type was requested (not ALL)
    if (postType) {
      whereClause.type = postType;
    }

    // Only add status filter if not requesting all statuses
    if (statusFilter) {
      whereClause.status = statusFilter;
    }


    // Filter on search terms
    if (search) {
    // Prisma reads this as: (Title has "search" OR Summary has "search")
    // It's also case-insensitive
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },   // Search in Title
        { summary: { contains: search, mode: "insensitive" } }, // OR in Summary
      ];
    }


    // Filter on categories
    if (categoryParam) {
      const categories = categoryParam.split(","); // Turn "tech,productivity" into ['tech', 'productivity']
      // Prisma reads this as: "Does this post have AT LEAST ONE category ('some') 
      // where the category name is in this list?"
      whereClause.categories = {
        some: {
          name: { in: categories }, // Filter posts that have ANY of these categories
        },
      };
    }

    // Filter on Resource Types
    if (resourceTypeParam) {
      const types = resourceTypeParam.split(",");
      
      // Prisma Logic:
      // "Find posts where the related 'resourceType' has a 'name' that is IN our list"
      whereClause.resourceType = {
        name: { in: types }
      };
    }

    // We check if EITHER dateFrom OR dateTo exists
    if (dateFromParam || dateToParam) {
      // We add a 'createdAt' filter to the whereClause
      whereClause.createdAt = {};

      // 1. Handle "From Date"
      if (dateFromParam) {
        // says that the createdAt must be greater than or equal to the dateFromParam
        whereClause.createdAt.gte = new Date(dateFromParam);
      }

      // 2. Handle "To Date"
      if (dateToParam) {
        // We need to move the time to 23:59:59 to capture all posts made that day
        // So the limit becomes midnight
        const dateTo = new Date(dateToParam);
        dateTo.setHours(23, 59, 59, 999); // Set to the very last millisecond of the day

        // says that the createdAt must be less than or equal to the dateToParam
        whereClause.createdAt.lte = dateTo;
      }
    }



    // 4. Execute the Query
    const posts = await prisma.post.findMany({
      where: whereClause,
      take: limit, // Fetch only 6
      skip: skip,  // Skip the previous pages
      orderBy: { createdAt: "desc" }, // Newest first
      include: {
        categories: true, // JOIN operation: Get the category & resourceType details too
        resourceType: true,
      },
    });

    // 5. Return the data as JSON
    return NextResponse.json(posts);

  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}