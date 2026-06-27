import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { requireAuthRole } from '../../lib/auth';
import { createServerFn } from '@tanstack/start';
import { db } from '../../db';
import { donations } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { matchDonationToTechnician } from '../../lib/matching';

const getPendingDonationsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAuthRole({ data: 'admin' });
    
    return await db.query.donations.findMany({
      where: eq(donations.status, 'pending_validation'),
      with: {
        // we might not have a relation setup in schema for donor, let's just get the raw data
      }
    });
  });

const getDonationsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await requireAuthRole({ data: 'admin' });
    return await db.select().from(donations).where(eq(donations.status, 'pending_validation'));
  });

const approveDonationFn = createServerFn({ method: "POST" })
  .validator((data: { donationId: string }) => data)
  .handler(async ({ data }) => {
    await requireAuthRole({ data: 'admin' });
    
    await db.update(donations)
      .set({ status: 'accepted' })
      .where(eq(donations.id, data.donationId));
      
    // Try to auto-assign a technician (default max radius 50km)
    const matchResult = await matchDonationToTechnician({ donationId: data.donationId, maxRadiusMeters: 50000 });

    return { success: true, matchResult };
  });

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    try {
      await requireAuthRole({ data: 'admin' });
    } catch (e) {
      throw redirect({ to: '/auth/login' });
    }
  },
  loader: async () => {
    return {
      pendingDonations: await getDonationsFn()
    };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { pendingDonations } = Route.useLoaderData();
  const router = useRouter();

  const handleApprove = async (donationId: string) => {
    try {
      await approveDonationFn({ data: { donationId } });
      router.invalidate();
    } catch (err: any) {
      alert(`Error approving: ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl mb-4">Pending Hardware Validations</h2>
      
      {pendingDonations.length === 0 ? (
        <p>No pending donations to validate.</p>
      ) : (
        <div className="grid gap-4">
          {pendingDonations.map((donation) => (
            <div key={donation.id} className="border p-4 rounded shadow-sm">
              <p><strong>ID:</strong> {donation.id}</p>
              <p><strong>Donor ID:</strong> {donation.donorId}</p>
              <p><strong>Details:</strong> {JSON.stringify(donation.hardwareDetails)}</p>
              <div className="my-2">
                <strong>Photos:</strong>
                <div className="flex gap-2 mt-1">
                  {donation.photos?.map((photo, i) => (
                    <img key={i} src={photo} alt={`Hardware ${i}`} className="w-24 h-24 object-cover border" />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleApprove(donation.id)}
                className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
              >
                Approve (Mark as Accepted)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
