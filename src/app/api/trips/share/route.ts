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
    const trips = await prisma.trip.findMany({
      where: {
        isTemplate: true,
      },
      include: {
        destination: true,
        Interest: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", error);

    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
