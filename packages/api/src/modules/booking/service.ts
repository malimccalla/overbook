import { db } from '@overbook/db';
import type { BookingStatus } from '@overbook/db';
import { GraphQLError } from 'graphql';

export class BookingRequestService {
  async list(orgId: string, opts?: { status?: BookingStatus; limit?: number; offset?: number }) {
    return db.booking.findMany({
      where: {
        organizationId: orgId,
        ...(opts?.status && { status: opts.status }),
      },
      include: { artist: true, rawEmail: true },
      orderBy: { createdAt: 'desc' },
      take: opts?.limit ?? 50,
      skip: opts?.offset ?? 0,
    });
  }

  async getById(orgId: string, id: string) {
    const booking = await db.booking.findUnique({
      where: { id },
      include: { artist: true, rawEmail: true },
    });

    if (!booking || booking.organizationId !== orgId) {
      throw new GraphQLError('Booking not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return booking;
  }

  async updateStatus(orgId: string, id: string, status: BookingStatus) {
    await this.getById(orgId, id);

    return db.booking.update({
      where: { id },
      data: { status },
      include: { artist: true },
    });
  }

  async count(orgId: string, status?: BookingStatus) {
    return db.booking.count({
      where: {
        organizationId: orgId,
        ...(status && { status }),
      },
    });
  }
}
