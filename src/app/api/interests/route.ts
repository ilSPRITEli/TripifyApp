import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

// Initialize Prisma with better error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw new Error('Database connection failed. Please check your DATABASE_URL environment variable.');
}

export async function GET() {
  try {
    // Return list of interests for filtering/selection
    const interests = await prisma.interest.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ interests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching interests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}
