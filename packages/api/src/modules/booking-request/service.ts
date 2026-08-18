import { db } from '@overbook/db';
import type { BookingRequestStatus } from '@overbook/db';
import { GraphQLError } from 'graphql';

export class BookingRequestService {
  async list(orgId: string, opts?: { status?: BookingRequestStatus; limit?: number; offset?: number }) {
    return db.bookingRequest.findMany({
      where: {
        organizationId: orgId,
        ...(opts?.status && { status: opts.status }),
      },
      include: { artist: true },
      orderBy: { createdAt: 'desc' },
      take: opts?.limit ?? 50,
      skip: opts?.offset ?? 0,
    });
  }

  async getById(orgId: string, id: string) {
    const request = await db.bookingRequest.findUnique({
      where: { id },
      include: { artist: true, rawEmail: true },
    });

    if (!request || request.organizationId !== orgId) {
      throw new GraphQLError('Booking request not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return request;
  }

  async dismiss(orgId: string, id: string) {
    const request = await this.getById(orgId, id);

    return db.bookingRequest.update({
      where: { id: request.id },
      data: { status: 'DISMISSED' },
      include: { artist: true },
    });
  }

  async count(orgId: string, status?: BookingRequestStatus) {
    return db.bookingRequest.count({
      where: {
        organizationId: orgId,
        ...(status && { status }),
      },
    });
  }
}
