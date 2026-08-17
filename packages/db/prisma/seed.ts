import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'korda-music' },
    update: {},
    create: {
      name: 'Korda Music',
      slug: 'korda-music',
    },
  });

  // Clean up old seed user if it exists
  await prisma.user.deleteMany({ where: { clerkId: 'seed_clerk_user_001' } });

  const user = await prisma.user.upsert({
    where: { email: 'malimccalla@gmail.com' },
    update: { name: 'Mali McCalla' },
    create: {
      clerkId: 'seed_clerk_user_001',
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
    { name: 'Dan Shake', aliases: [], genres: ['house', 'disco'] },
    { name: 'TENNIN', aliases: [], genres: ['electronic', 'experimental'] },
    { name: 'OUO', aliases: [], genres: ['electronic', 'club'] },
  ];

  for (const a of artists) {
    await prisma.artist.upsert({
      where: {
        id: `seed_${a.name.toLowerCase().replace(/\s/g, '_')}`,
      },
      update: {},
      create: {
        id: `seed_${a.name.toLowerCase().replace(/\s/g, '_')}`,
        organizationId: org.id,
        agentId: user.id,
        name: a.name,
        aliases: a.aliases,
        genres: a.genres,
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
      displayName: 'Korda Music Inbox',
    },
  });

  console.log('Seeded: org=%s, user=%s, 3 artists, 1 inbox', org.id, user.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
