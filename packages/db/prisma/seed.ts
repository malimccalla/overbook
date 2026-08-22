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

  // Seed bookings with various statuses
  const bookings = [
    {
      id: 'booking_1',
      artistId: 'artist_dan_shake',
      promoter: 'Jake Thompson',
      promoterEmail: 'jake@groovegarden.co.uk',
      venue: 'Phonox',
      city: 'London',
      country: 'United Kingdom',
      proposedDate: new Date('2026-03-15'),
      rawFee: '£3,500',
      feeAmount: 350000,
      currencyCode: 'GBP',
      status: 'NEEDS_REVIEW' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Groove Garden', capacity: '600' },
    },
    {
      id: 'booking_2',
      artistId: 'artist__me',
      promoter: 'Lena Richter',
      promoterEmail: 'lena@tiefgang-berlin.de',
      venue: 'Säälchen at Holzmarkt',
      city: 'Berlin',
      country: 'Germany',
      proposedDate: new Date('2026-03-22'),
      rawFee: '€4,500',
      feeAmount: 450000,
      currencyCode: 'EUR',
      status: 'NEEDS_REVIEW' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Tiefgang', capacity: '350' },
    },
    {
      id: 'booking_3',
      artistId: 'artist_cinthie',
      promoter: 'Rachel Adams',
      promoterEmail: 'rachel@nightshift.london',
      venue: 'Village Underground',
      city: 'London',
      country: 'United Kingdom',
      proposedDate: new Date('2026-03-22'),
      rawFee: '€2,800',
      feeAmount: 280000,
      currencyCode: 'EUR',
      status: 'PENCILLED' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Nightshift', capacity: '800' },
    },
    {
      id: 'booking_4',
      artistId: 'artist_hunee',
      promoter: 'Sasha Lord',
      promoterEmail: 'sasha@warehouseproject.com',
      venue: 'Depot Mayfield',
      city: 'Manchester',
      country: 'United Kingdom',
      proposedDate: new Date('2026-12-31'),
      rawFee: '£12,000',
      feeAmount: 1200000,
      currencyCode: 'GBP',
      status: 'CONFIRMED' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Warehouse Project NYE', capacity: '10000' },
    },
    {
      id: 'booking_5',
      artistId: 'artist_elkka',
      promoter: 'Marcus Webb',
      promoterEmail: 'marcus@midnightarchitecture.co.uk',
      venue: 'The Cause',
      city: 'London',
      country: 'United Kingdom',
      proposedDate: new Date('2026-03-07'),
      rawFee: '£1,800',
      feeAmount: 180000,
      currencyCode: 'GBP',
      status: 'NEEDS_REVIEW' as const,
      missingFields: ['capacity'],
      conflictFlags: [],
      details: { event_name: 'Midnight Architecture' },
    },
    {
      id: 'booking_6',
      artistId: 'artist_bibi_seck',
      promoter: 'Tom Harris',
      promoterEmail: 'tom@fabriclondon.com',
      venue: 'Fabric',
      city: 'London',
      country: 'United Kingdom',
      proposedDate: new Date('2026-10-28'),
      rawFee: '£4,000',
      feeAmount: 400000,
      currencyCode: 'GBP',
      status: 'NEEDS_REVIEW' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Fabric Saturdays', capacity: '1500' },
    },
    {
      id: 'booking_7',
      artistId: 'artist_dixon',
      promoter: 'Andrea Rossi',
      promoterEmail: 'andrea@circoloco.com',
      venue: 'DC-10',
      city: 'Ibiza',
      country: 'Spain',
      proposedDate: new Date('2026-07-15'),
      rawFee: '€18,000',
      feeAmount: 1800000,
      currencyCode: 'EUR',
      status: 'SENT_TO_ARTIST' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Circoloco', capacity: '5000' },
    },
    {
      id: 'booking_8',
      artistId: 'artist_mr_scruff',
      promoter: 'Dave Wilson',
      promoterEmail: 'dave@band-on-the-wall.org',
      venue: 'Band on the Wall',
      city: 'Manchester',
      country: 'United Kingdom',
      proposedDate: new Date('2026-04-12'),
      rawFee: '£2,500',
      feeAmount: 250000,
      currencyCode: 'GBP',
      status: 'NEEDS_REVIEW' as const,
      missingFields: ['set_time'],
      conflictFlags: ['Date conflicts with confirmed show in Manchester'],
      details: { event_name: 'Keep It Unreal', capacity: '300' },
    },
    {
      id: 'booking_9',
      artistId: 'artist_sama__abdulhadi',
      promoter: 'Claudia Fischer',
      promoterEmail: 'claudia@tresor-berlin.com',
      venue: 'Tresor',
      city: 'Berlin',
      country: 'Germany',
      proposedDate: new Date('2026-05-30'),
      rawFee: '€5,500',
      feeAmount: 550000,
      currencyCode: 'EUR',
      status: 'DECLINED' as const,
      missingFields: [],
      conflictFlags: [],
      details: { event_name: 'Tresor.Klubnacht' },
    },
    {
      id: 'booking_10',
      artistId: 'artist_gerd_janson',
      promoter: 'Sophie Laurent',
      promoterEmail: 'sophie@concrete-paris.fr',
      venue: 'Concrete',
      city: 'Paris',
      country: 'France',
      proposedDate: new Date('2026-06-20'),
      rawFee: '€6,000',
      feeAmount: 600000,
      currencyCode: 'EUR',
      status: 'INBOX' as const,
      missingFields: ['exclusivity', 'billing'],
      conflictFlags: [],
      details: { event_name: 'Running Back Night' },
    },
  ];

  for (const b of bookings) {
    await prisma.booking.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        organizationId: org.id,
        artistId: b.artistId,
        promoter: b.promoter,
        promoterEmail: b.promoterEmail,
        venue: b.venue,
        city: b.city,
        country: b.country,
        proposedDate: b.proposedDate,
        rawFee: b.rawFee,
        feeAmount: b.feeAmount,
        currencyCode: b.currencyCode,
        status: b.status,
        missingFields: b.missingFields,
        conflictFlags: b.conflictFlags,
        details: b.details,
        source: 'EMAIL',
      },
    });
  }

  console.log('Seeded: org=%s, user=%s, %d artists, %d bookings, 1 inbox', org.id, user.id, artists.length, bookings.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
