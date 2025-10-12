import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Prisma with better error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw new Error('Database connection failed. Please check your DATABASE_URL environment variable.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      selectedDestination, 
      depatureDate, 
      returnDate, 
      travlers, 
      budget, 
      interests 
    } = body;

    // Validate required fields
    if (!name || !selectedDestination || !depatureDate || !returnDate || !travlers || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare trip data
    const tripData: any = {
      title: name,
      description: `Trip to ${selectedDestination.city}, ${selectedDestination.country}`,
      startDate: new Date(depatureDate),
      endDate: new Date(returnDate),
      travelers: travlers,
      budget: budget,
      destinations: {
        create: {
          country: selectedDestination.country,
          city: selectedDestination.city,
          description: selectedDestination.description,
          latitude: selectedDestination.latitude,
          longitude: selectedDestination.longitude,
          budget: budget, // You might want to calculate this differently
        }
      }
    };

    // Add interestId only if interests exist and have valid IDs
    if (interests && interests.length > 0 && interests[0].id) {
      // Verify that the interest exists in the database
      const existingInterest = await prisma.interest.findUnique({
        where: { id: interests[0].id }
      });
      
      if (existingInterest) {
        tripData.interestId = interests[0].id;
      } else {
        console.warn(`Interest with ID ${interests[0].id} not found in database. Skipping interest assignment.`);
      }
    }

    // Create the trip
    const trip = await prisma.trip.create({
      data: tripData,
      include: {
        destinations: true,
        Interest: true
      }
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your environment configuration.' },
        { status: 500 }
      );
    }
    
    // Check for foreign key constraint violations
    if (error instanceof Error && error.message.includes('Foreign key constraint violated')) {
      return NextResponse.json(
        { error: 'Invalid reference data. Please check your interest selection.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
