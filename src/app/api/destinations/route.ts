import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma with better error handling
let prisma: PrismaClient;
export const runtime = "nodejs";
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  throw new Error(
    "Database connection failed. Please check your DATABASE_URL environment variable."
  );
}

export async function GET() {
  try {
    // Return list of interests for filtering/selection
    const destinations = await prisma.destination.findMany({
      orderBy: [{ city: "asc" }, { country: "asc" }],
    });
    return NextResponse.json({ destinations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}
