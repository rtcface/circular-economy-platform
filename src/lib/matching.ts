import { db } from '../db';
import { donations, users } from '../db/schema';
import { eq, sql, and, lt } from 'drizzle-orm';

export interface MatchRequest {
  donationId: string;
  maxRadiusMeters: number;
}

export interface MatchResponse {
  success: boolean;
  assignedTechnicianId?: string;
  reason?: string;
}

export async function matchDonationToTechnician(req: MatchRequest): Promise<MatchResponse> {
  const donationQuery = await db.select().from(donations).where(eq(donations.id, req.donationId)).limit(1);
  if (!donationQuery.length) {
    return { success: false, reason: 'Donation not found' };
  }
  
  const d = donationQuery[0];
  if (d.status !== 'accepted' && d.status !== 'pending_match') {
    return { success: false, reason: `Invalid status: ${d.status}` };
  }
  
  if (!d.location) {
    return { success: false, reason: 'Donation has no location data' };
  }

  // Find technicians within maxRadiusMeters who have capacity (currentLoad < maxCapacity)
  // Ordered by distance
  const [lng, lat] = d.location as [number, number];
  
  // PostGIS location geometry
  const donationGeom = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;
  
  const availableTechnicians = await db.select({
    id: users.id,
    distance: sql<number>`ST_Distance(${users.location}::geography, ${donationGeom})`.as('distance'),
  })
  .from(users)
  .where(
    and(
      eq(users.role, 'technician'),
      eq(users.status, 'active'),
      lt(users.currentLoad, users.maxCapacity),
      sql`ST_DWithin(${users.location}::geography, ${donationGeom}, ${req.maxRadiusMeters})`
    )
  )
  .orderBy(sql`distance ASC`)
  .limit(1);

  if (availableTechnicians.length === 0) {
    // Flag as pending match
    await db.update(donations)
      .set({ status: 'pending_match' })
      .where(eq(donations.id, req.donationId));
      
    return { success: false, reason: 'No technicians available within radius or capacity' };
  }

  const tech = availableTechnicians[0];

  // Assign to technician
  await db.transaction(async (tx) => {
    await tx.update(donations)
      .set({
        technicianId: tech.id,
        status: 'assigned'
      })
      .where(eq(donations.id, req.donationId));
      
    await tx.update(users)
      .set({ currentLoad: sql`${users.currentLoad} + 1` })
      .where(eq(users.id, tech.id));
  });

  return { success: true, assignedTechnicianId: tech.id };
}
