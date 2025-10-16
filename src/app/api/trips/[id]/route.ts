import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

let prisma: PrismaClient;
export const runtime = "nodejs";
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  throw new Error("Database connection failed. Check DATABASE_URL.");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        destination: true,
        Interest: true,
        activities: {
          orderBy: [{ date: "asc" }],
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ trip }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { isTemplate, title, description } = body as Partial<{ isTemplate: boolean; title: string; description: string }>;

    const updated = await prisma.trip.update({
      where: { id: params.id },
      data: {
        ...(typeof isTemplate === "boolean" ? { isTemplate } : {}),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
      },
    });

    return NextResponse.json({ trip: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

