import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// 1. Mock DB state
import { db } from '../../db';
import { users, donations } from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const testTechId = '30000000-0000-0000-0000-000000000001';
const testDonorId = '30000000-0000-0000-0000-000000000002';
const testDonationId = '40000000-0000-0000-0000-000000000001';

// 2. Mock lib/auth
vi.mock('../../lib/auth', () => ({
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

let mockDonations: any[] = [];

// 4. Mock react-router
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: any) => {
    config.component.useLoaderData = () => ({
      assignedDonations: mockDonations
    });
    return config.component;
  },
  useRouter: () => ({ invalidate: vi.fn() }),
  redirect: vi.fn(),
}));

import { Route } from './index';

describe('Technician Dashboard DB integration', () => {
  beforeAll(async () => {
    // Run migrations just in case it hasn't run
    const sql = postgres('postgres://postgres:password@localhost:5433/circular_economy');
    const drizzleDir = path.resolve(__dirname, '../../../drizzle');
    if (fs.existsSync(drizzleDir)) {
      const files = fs.readdirSync(drizzleDir).filter(f => f.endsWith('.sql')).sort();
      for (const f of files) {
        try {
          const fileContent = fs.readFileSync(path.join(drizzleDir, f), 'utf8');
          await sql.unsafe(fileContent);
        } catch(e) {
          console.log(`Migration ${f} skipped or failed in test setup`, e);
        }
      }
    }
    
    // Cleanup
    await db.delete(donations).where(eq(donations.id, testDonationId));
    await db.delete(users).where(inArray(users.id, [testTechId, testDonorId]));

    // Seed users
    await db.insert(users).values([
      { id: testTechId, email: 'tech@test.com', passwordHash: 'hash', role: 'technician', status: 'active' },
      { id: testDonorId, email: 'donor@test.com', passwordHash: 'hash', role: 'donor', status: 'active' }
    ]);
  });

  afterAll(async () => {
    await db.delete(donations).where(eq(donations.id, testDonationId));
    await db.delete(users).where(inArray(users.id, [testTechId, testDonorId]));
  });

  beforeEach(async () => {
    await db.delete(donations).where(eq(donations.id, testDonationId));
  });

  it('updates donation status from assigned to in_progress', async () => {
    await db.insert(donations).values({
      id: testDonationId,
      donorId: testDonorId,
      technicianId: testTechId,
      status: 'assigned',
      location: [0, 0]
    });
    mockDonations = [{
      id: testDonationId,
      technicianId: testTechId,
      status: 'assigned',
      hardwareDetails: { type: 'laptop' }
    }];

    const Component = Route as any;
    render(<Component />);
    
    const startBtn = screen.getByRole('button', { name: 'Start Work' });
    fireEvent.click(startBtn);

    // Give it time to hit the DB
    await new Promise(r => setTimeout(r, 500));

    // Verify DB
    const updated = await db.select().from(donations).where(eq(donations.id, testDonationId));
    expect(updated[0].status).toBe('in_progress');
  });

  it('updates donation status from in_progress to ready_to_deploy', async () => {
    await db.insert(donations).values({
      id: testDonationId,
      donorId: testDonorId,
      technicianId: testTechId,
      status: 'in_progress',
      location: [0, 0]
    });
    mockDonations = [{
      id: testDonationId,
      technicianId: testTechId,
      status: 'in_progress',
      hardwareDetails: { type: 'laptop' }
    }];

    const Component = Route as any;
    render(<Component />);
    
    const deployBtn = screen.getByRole('button', { name: 'Mark Ready to Deploy' });
    fireEvent.click(deployBtn);

    await new Promise(r => setTimeout(r, 500));

    const updated = await db.select().from(donations).where(eq(donations.id, testDonationId));
    expect(updated[0].status).toBe('ready_to_deploy');
  });

  it('updates donation status from in_progress to unrepairable', async () => {
    await db.insert(donations).values({
      id: testDonationId,
      donorId: testDonorId,
      technicianId: testTechId,
      status: 'in_progress',
      location: [0, 0]
    });
    mockDonations = [{
      id: testDonationId,
      technicianId: testTechId,
      status: 'in_progress',
      hardwareDetails: { type: 'laptop' }
    }];

    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Motherboard burnt');

    const Component = Route as any;
    const { unmount } = render(<Component />);
    
    const unrepairableBtn = screen.getByRole('button', { name: 'Mark Unrepairable' });
    fireEvent.click(unrepairableBtn);

    await new Promise(r => setTimeout(r, 500));

    const updated = await db.select().from(donations).where(eq(donations.id, testDonationId));
    expect(updated[0].status).toBe('unrepairable');
    expect(updated[0].failureReason).toBe('Motherboard burnt');
    unmount();
    promptSpy.mockRestore();
  });
});
