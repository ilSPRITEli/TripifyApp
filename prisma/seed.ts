import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const interests = [
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e01', name: 'Adventure', icon: '🏞️' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e02', name: 'Culture', icon: '🏛️' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e03', name: 'Relaxation', icon: '🏖️' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e04', name: 'Nature', icon: '🌲' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e05', name: 'Food & Drink', icon: '🍽️' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e06', name: 'History', icon: '🏺' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e07', name: 'Wildlife', icon: '🦁' },
  { id: '8e110925-89cc-4a26-bde6-f36363fd6e08', name: 'Shopping', icon: '🛍️' },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing interests
  await prisma.interest.deleteMany();
  console.log('Cleared existing interests');

  // Create interests
  for (const interest of interests) {
    await prisma.interest.create({
      data: interest,
    });
  }
  console.log('Created interests');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
