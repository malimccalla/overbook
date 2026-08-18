import type { Artist, Booking, BookingRequest } from '@overbook/db';

import { builder } from '../../graphql/builder.js';
import { ArtistRef, BookingRequestRef } from '../booking-request/types.js';

type BookingWithRelations = Booking & {
  artist?: Artist | null;
  bookingRequest?: BookingRequest | null;
};

const BookingRef = builder.objectRef<BookingWithRelations>('Booking');
builder.objectType(BookingRef, {
  fields: (t) => ({
    id: t.exposeString('id'),
    promoter: t.exposeString('promoter', { nullable: true }),
    venue: t.exposeString('venue', { nullable: true }),
    city: t.exposeString('city', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
    date: t.expose('date', { type: 'DateTime', nullable: true }),
    feeAmount: t.exposeInt('feeAmount', { nullable: true }),
    currencyCode: t.exposeString('currencyCode', { nullable: true }),
    status: t.exposeString('status'),
    notes: t.exposeString('notes', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    artist: t.field({
      type: ArtistRef,
      nullable: true,
      resolve: (parent) => parent.artist ?? null,
    }),
    bookingRequest: t.field({
      type: BookingRequestRef,
      nullable: true,
      resolve: (parent) => parent.bookingRequest ?? null,
    }),
  }),
});

export { BookingRef };
