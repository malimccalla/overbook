import { db } from '@overbook/db';
import { GraphQLError } from 'graphql';

export class BookingService {
  async createFromRequest(orgId: string, bookingRequestId: string) {
    const request = await db.bookingRequest.findUnique({
      where: { id: bookingRequestId },
    });

    if (!request || request.organizationId !== orgId) {
      throw new GraphQLError('Booking request not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    if (!request.artistId) {
      throw new GraphQLError('Cannot create booking without a matched artist', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (request.status === 'CAPTURED') {
      throw new GraphQLError('Booking request already captured', {
        extensions: { code: 'CONFLICT' },
      });
    }

    const [booking] = await db.$transaction([
      db.booking.create({
        data: {
          organizationId: orgId,
          artistId: request.artistId,
          bookingRequestId: request.id,
          promoter: request.promoter,
          venue: request.venue,
          city: request.city,
          country: request.country,
          date: request.proposedDate,
          feeAmount: request.feeAmount,
          currencyCode: request.currencyCode,
          status: 'CAPTURED',
        },
        include: { artist: true, bookingRequest: true },
      }),
      db.bookingRequest.update({
        where: { id: request.id },
        data: { status: 'CAPTURED' },
      }),
    ]);

    return booking;
  }

  async list(orgId: string) {
    return db.booking.findMany({
      where: { organizationId: orgId },
      include: { artist: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(orgId: string, id: string) {
    const booking = await db.booking.findUnique({
      where: { id },
      include: { artist: true, bookingRequest: true },
    });

    if (!booking || booking.organizationId !== orgId) {
      throw new GraphQLError('Booking not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return booking;
  }
}
