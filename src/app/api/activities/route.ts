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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripId,
      name,
      description,
      date,
      time,
      latitude,
      longitude,
      location,
      budget,
    } = body as {
      tripId: string;
      name: string;
      description: string;
      date: string | Date;
      time: string;
      latitude: number;
      longitude: number;
      location: string;
      budget: number;
    };

    if (!tripId || !name || !description || !date || !time || latitude == null || longitude == null || !location || budget == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        date: new Date(date),
        time,
        latitude,
        longitude,
        location,
        budget,
        tripId,
      },
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

