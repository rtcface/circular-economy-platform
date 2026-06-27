import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// 1. Mock DB state
import { db } from './app/db';
import { users, donations } from './app/db/schema';
import { eq, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import fs from 'fs';

const testTechId = '30000000-0000-0000-0000-000000000001';
const testDonorId = '30000000-0000-0000-0000-000000000002';
const testDonationId = '40000000-0000-0000-0000-000000000001';

// 2. Mock lib/auth
vi.mock('./app/lib/auth', () => ({
  requireAuthRole: vi.fn().mockResolvedValue({ id: '30000000-0000-0000-0000-000000000001', role: 'technician' })
}));

// 3. Mock tanstack/start
vi.mock('@tanstack/start', () => {
  return {
    createServerFn: () => {
      let handlerFn: any;
      const chain: any = {
        validator: () => chain,
        handler: (h: any) => {
          handlerFn = h;
          return async (opts: any) => handlerFn(opts);
        }
      };
      return chain;
    }
  };
});

// 4. Mock react-router
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: any) => {
    config.component.useLoaderData = () => ({
      assignedDonations: [
        {
          id: '40000000-0000-0000-0000-000000000001',
          technicianId: '30000000-0000-0000-0000-000000000001',
          status: 'assigned',
          hardwareDetails: { type: 'laptop' }
        }
      ]
    });
    return config.component;
  },
  useRouter: () => ({ invalidate: vi.fn() }),
  redirect: vi.fn(),
}));

import { Route } from './app/routes/technician/index';

describe('Technician Dashboard DB integration', () => {
  beforeAll(async () => {
    // Run migrations
    const sql = postgres('postgres://postgres:password@localhost:5433/circular_economy');
    const drizzleDir = 'drizzle';
    const files = fs.readdirSync(drizzleDir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      try {
        const fileContent = fs.readFileSync(`${drizzleDir}/${f}`, 'utf8');
        await sql.unsafe(fileContent);
      } catch(e) {
        // ignore if already exists
      }
    }

    // Cleanup
    await db.delete(donations).where(eq(donations.id, testDonationId));
    await db.delete(users).where(inArray(users.id, [testTechId, testDonorId]));

    // Seed
    await db.insert(users).values([
      { id: testTechId, email: 'tech@test.com', passwordHash: 'hash', role: 'technician', status: 'active' },
      { id: testDonorId, email: 'donor@test.com', passwordHash: 'hash', role: 'donor', status: 'active' }
    ]);
    await db.insert(donations).values({
      id: testDonationId,
      donorId: testDonorId,
      technicianId: testTechId,
      status: 'assigned',
      location: [0, 0]
    });
  });

  afterAll(async () => {
    await db.delete(donations).where(eq(donations.id, testDonationId));
    await db.delete(users).where(inArray(users.id, [testTechId, testDonorId]));
  });

  it('updates donation status in db when clicked', async () => {
    const Component = Route as any;
    render(<Component />);
    
    expect(screen.getByText('Technician Dashboard')).toBeDefined();
    
    const startBtn = screen.getByRole('button', { name: 'Start Work' });
    fireEvent.click(startBtn);

    // Give it time to hit the DB
    await new Promise(r => setTimeout(r, 500));

    // Verify DB
    const updated = await db.select().from(donations).where(eq(donations.id, testDonationId));
    expect(updated[0].status).toBe('in_progress');
  });
});
