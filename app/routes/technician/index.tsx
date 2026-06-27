import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { requireAuthRole } from '../../lib/auth';
import { createServerFn } from '@tanstack/start';
import { db } from '../../db';
import { donations } from '../../db/schema';
import { eq, inArray, and } from 'drizzle-orm';

const getAssignedDonationsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await requireAuthRole({ data: 'technician' });
    
    return await db.select().from(donations).where(
      and(
        eq(donations.technicianId, user.id),
        inArray(donations.status, ['assigned', 'in_progress'])
      )
    );
  });

const updateDonationStatusFn = createServerFn({ method: "POST" })
  .validator((data: { donationId: string, status: 'in_progress' | 'ready_to_deploy' | 'unrepairable', reason?: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireAuthRole({ data: 'technician' });

    if (data.status === 'unrepairable' && !data.reason) {
      throw new Error('A reason is required when marking a donation as unrepairable');
    }
    
    // Ensure the technician owns this donation
    const donation = await db.select().from(donations).where(
      and(
        eq(donations.id, data.donationId),
        eq(donations.technicianId, user.id)
      )
    ).limit(1);

    if (!donation.length) {
      throw new Error('Donation not found or not assigned to you');
    }

    await db.update(donations)
      .set({ 
        status: data.status,
        ...(data.status === 'unrepairable' ? { failureReason: data.reason } : {})
      })
      .where(eq(donations.id, data.donationId));
      
    return { success: true };
  });

export const Route = createFileRoute('/technician/')({
  beforeLoad: async () => {
    try {
      await requireAuthRole({ data: 'technician' });
    } catch (e) {
      throw redirect({ to: '/auth/login' });
    }
  },
  loader: async () => {
    return {
      assignedDonations: await getAssignedDonationsFn()
    };
  },
  component: TechnicianDashboard,
});

function TechnicianDashboard() {
  const { assignedDonations } = Route.useLoaderData();
  const router = useRouter();

  const handleStatusUpdate = async (donationId: string, status: 'in_progress' | 'ready_to_deploy' | 'unrepairable') => {
    try {
      let reason: string | undefined;
      if (status === 'unrepairable') {
        const userInput = prompt('Please provide a reason why this hardware is unrepairable:');
        if (!userInput) return; // cancel if empty or cancelled
        reason = userInput;
      }
      await updateDonationStatusFn({ data: { donationId, status, reason } });
      router.invalidate();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>
      <h2 className="text-xl mb-4">Your Assigned Hardware</h2>

      {assignedDonations.length === 0 ? (
        <p>You have no pending refurbishments at this time.</p>
      ) : (
        <div className="grid gap-4">
          {assignedDonations.map((donation) => (
            <div key={donation.id} className="border p-4 rounded shadow-sm">
              <p><strong>ID:</strong> {donation.id}</p>
              <p><strong>Current Status:</strong> {donation.status}</p>
              <p><strong>Details:</strong> {JSON.stringify(donation.hardwareDetails)}</p>
              
              <div className="mt-4 flex gap-2">
                {donation.status === 'assigned' && (
                  <button
                    onClick={() => handleStatusUpdate(donation.id, 'in_progress')}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Start Work
                  </button>
                )}
                {donation.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'ready_to_deploy')}
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                    >
                      Mark Ready to Deploy
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'unrepairable')}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Mark Unrepairable
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
