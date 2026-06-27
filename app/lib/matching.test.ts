import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { users, donations } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { matchDonationToTechnician } from './matching';

describe('Geospatial Matching', () => {
  const testIds = {
    donor: '10000000-0000-0000-0000-000000000001',
    techClose: '10000000-0000-0000-0000-000000000002',
    techFar: '10000000-0000-0000-0000-000000000003',
    techFull: '10000000-0000-0000-0000-000000000004',
    donation1: '20000000-0000-0000-0000-000000000001',
    donation2: '20000000-0000-0000-0000-000000000002',
    donation3: '20000000-0000-0000-0000-000000000003',
  };

  beforeAll(async () => {
    // Clean up just in case
    await db.delete(donations).where(inArray(donations.id, [testIds.donation1, testIds.donation2, testIds.donation3]));
    await db.delete(users).where(inArray(users.id, [testIds.donor, testIds.techClose, testIds.techFar, testIds.techFull]));

    // Insert mock users
    await db.insert(users).values([
      {
        id: testIds.donor,
        email: 'donor_match_test@example.com',
        passwordHash: 'hash',
        role: 'donor',
        status: 'active',
        location: [0, 0] // 0, 0
      },
      {
        id: testIds.techClose,
        email: 'tech_close@example.com',
        passwordHash: 'hash',
        role: 'technician',
        status: 'active',
        location: [0.01, 0.01], // approx 1.5km away from 0,0
        maxCapacity: 5,
        currentLoad: 0
      },
      {
        id: testIds.techFar,
        email: 'tech_far@example.com',
        passwordHash: 'hash',
        role: 'technician',
        status: 'active',
        location: [1, 1], // approx 156km away
        maxCapacity: 5,
        currentLoad: 0
      },
      {
        id: testIds.techFull,
        email: 'tech_full@example.com',
        passwordHash: 'hash',
        role: 'technician',
        status: 'active',
        location: [0.005, 0.005], // very close!
        maxCapacity: 5,
        currentLoad: 5 // AT CAPACITY
      }
    ]);
  });

  afterAll(async () => {
    await db.delete(donations).where(inArray(donations.id, [testIds.donation1, testIds.donation2, testIds.donation3]));
    await db.delete(users).where(inArray(users.id, [testIds.donor, testIds.techClose, testIds.techFar, testIds.techFull]));
  });

  it('assigns to the closest available technician with capacity', async () => {
    await db.insert(donations).values({
      id: testIds.donation1,
      donorId: testIds.donor,
      status: 'accepted',
      location: [0, 0]
    });

    const res = await matchDonationToTechnician({
      donationId: testIds.donation1,
      maxRadiusMeters: 50000 // 50km
    });

    expect(res.success).toBe(true);
    expect(res.assignedTechnicianId).toBe(testIds.techClose);

    const updated = await db.select().from(donations).where(eq(donations.id, testIds.donation1));
    expect(updated[0].status).toBe('assigned');
    expect(updated[0].technicianId).toBe(testIds.techClose);
  });

  it('fails if no technician is within radius', async () => {
    await db.insert(donations).values({
      id: testIds.donation2,
      donorId: testIds.donor,
      status: 'accepted',
      location: [0, 0]
    });

    const res = await matchDonationToTechnician({
      donationId: testIds.donation2,
      maxRadiusMeters: 1000 // 1km max radius
    });

    // Both techClose (1.5km) and techFar (156km) are outside radius. techFull is close but full.
    expect(res.success).toBe(false);
    expect(res.reason).toContain('No technicians available');

    const updated = await db.select().from(donations).where(eq(donations.id, testIds.donation2));
    expect(updated[0].status).toBe('pending_match');
  });

  it('skips technicians at full capacity', async () => {
    // Handled in the first test inherently because techFull is closer than techClose
    // but we can double check
    const techFullData = await db.select().from(users).where(eq(users.id, testIds.techFull));
    expect(techFullData[0].currentLoad).toBe(5);
  });
});
