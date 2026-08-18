import { db } from '@overbook/db';

export class ArtistService {
  async list(orgId: string) {
    return db.artist.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async getById(orgId: string, id: string) {
    const artist = await db.artist.findUnique({ where: { id } });
    if (!artist || artist.organizationId !== orgId) return null;
    return artist;
  }

  async create(orgId: string, input: { name: string; aliases?: string[]; genres?: string[] }) {
    return db.artist.create({
      data: {
        organizationId: orgId,
        name: input.name,
        aliases: input.aliases ?? [],
        genres: input.genres ?? [],
      },
    });
  }
}
