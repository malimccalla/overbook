import type { db } from '@overbook/db';

export interface ApiContext {
  db: typeof db;
  userId: string | null;
  orgId: string | null;
}
