import type { Artist, BookingRequest, RawEmail } from '@overbook/db';

import { builder } from '../../graphql/builder.js';

// -- Object types --

const ArtistRef = builder.objectRef<Artist>('Artist');
builder.objectType(ArtistRef, {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    aliases: t.exposeStringList('aliases'),
    genres: t.exposeStringList('genres'),
  }),
});

const RawEmailRef = builder.objectRef<RawEmail>('RawEmail');
builder.objectType(RawEmailRef, {
  fields: (t) => ({
    id: t.exposeString('id'),
    subject: t.exposeString('subject', { nullable: true }),
    fromEmail: t.exposeString('fromEmail', { nullable: true }),
    fromName: t.exposeString('fromName', { nullable: true }),
    bodyText: t.exposeString('bodyText'),
    receivedAt: t.expose('receivedAt', { type: 'DateTime' }),
  }),
});

type BookingRequestWithRelations = BookingRequest & {
  artist?: Artist | null;
  rawEmail?: RawEmail | null;
};

const BookingRequestRef = builder.objectRef<BookingRequestWithRelations>('BookingRequest');
builder.objectType(BookingRequestRef, {
  fields: (t) => ({
    id: t.exposeString('id'),
    promoter: t.exposeString('promoter', { nullable: true }),
    promoterEmail: t.exposeString('promoterEmail', { nullable: true }),
    venue: t.exposeString('venue', { nullable: true }),
    city: t.exposeString('city', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
    proposedDate: t.expose('proposedDate', { type: 'DateTime', nullable: true }),
    proposedDateRaw: t.exposeString('proposedDateRaw', { nullable: true }),
    feeAmount: t.exposeInt('feeAmount', { nullable: true }),
    currencyCode: t.exposeString('currencyCode', { nullable: true }),
    rawFee: t.exposeString('rawFee', { nullable: true }),
    status: t.exposeString('status'),
    confidence: t.exposeFloat('confidence', { nullable: true }),
    missingFields: t.exposeStringList('missingFields'),
    conflictFlags: t.exposeStringList('conflictFlags'),
    summary: t.exposeString('summary', { nullable: true }),
    notes: t.exposeString('notes', { nullable: true }),
    recommendedNextAction: t.exposeString('recommendedNextAction', { nullable: true }),
    details: t.expose('details', { type: 'JSON', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    artist: t.field({
      type: ArtistRef,
      nullable: true,
      resolve: (parent) => parent.artist ?? null,
    }),
    rawEmail: t.field({
      type: RawEmailRef,
      nullable: true,
      resolve: (parent) => parent.rawEmail ?? null,
    }),
  }),
});

export { BookingRequestRef, ArtistRef, RawEmailRef };
