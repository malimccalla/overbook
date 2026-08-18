import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: 'org_elastic_artists' },
    update: { clerkOrgId: 'org_3I2ZYYJ9MlhUVcIA7Xw35vbChb9' },
    create: {
      id: 'org_elastic_artists',
      name: 'Elastic Artists',
      slug: 'elastic-artists',
      clerkOrgId: 'org_3I2ZYYJ9MlhUVcIA7Xw35vbChb9',
    },
  });

  const user = await prisma.user.upsert({
    where: { id: 'user_mali' },
    update: { clerkId: 'user_3I2ZLQBXsPlee5Dt7RXlOZ9aGKl' },
    create: {
      id: 'user_mali',
      clerkId: 'user_3I2ZLQBXsPlee5Dt7RXlOZ9aGKl',
      email: 'malimccalla@gmail.com',
      name: 'Mali McCalla',
    },
  });

  await prisma.membership.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
    update: {},
    create: {
      organizationId: org.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  const artists = [
    'Acid Pauli',
    'AliA',
    'Âme',
    'Axel Boman',
    'Bibi Seck',
    'CC:DISCO!',
    'Cinthie',
    'Cormac',
    'Curses',
    'Dan Shake',
    'Denis Horvat',
    'Dixon',
    'DJ Fuckoff',
    'Elkka',
    'Fiona Zanetti',
    'Fonzo',
    'Franziska Berns',
    'Gerd Janson',
    'Howling',
    'HUNEE',
    'HVOB',
    'JAMIIE',
    'Jimi Jules',
    'Julya Karma',
    'KOLLIN',
    'Laurence Guy',
    'LazerGazer',
    'Lola Haro',
    'Ludmila Di Pasquale',
    'Ma Sha',
    'Mietze Conte',
    'Miley Serious',
    'Mr Scruff',
    'Noah Baine',
    'Paula Tape',
    'Riria',
    'Roman Flügel',
    'RY X (DJ)',
    'ryota',
    "Sama' Abdulhadi",
    'Tai Lokun',
    'Trikk',
    'X & Ivy',
    'Yung Singh',
  ];

  for (const name of artists) {
    const id = `artist_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.artist.upsert({
      where: { id },
      update: { name },
      create: {
        id,
        organizationId: org.id,
        name,
        aliases: [],
        genres: [],
      },
    });
  }

  await prisma.connectedInbox.upsert({
    where: {
      organizationId_email: { organizationId: org.id, email: 'malimccalla@gmail.com' },
    },
    update: {},
    create: {
      organizationId: org.id,
      userId: user.id,
      email: 'malimccalla@gmail.com',
      displayName: 'Elastic Artists Inbox',
    },
  });

  console.log('Seeded: org=%s, user=%s, %d artists, 1 inbox', org.id, user.id, artists.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
