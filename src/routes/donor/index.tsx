import { createFileRoute, redirect } from '@tanstack/react-router';
import { requireAuthRole } from '../../lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { donations } from '../../db/schema';
import { useState } from 'react';

const submitDonationFn = createServerFn({ method: "POST" })
  .validator((data: { hardwareDetails: string; photos: string[]; lat: number; lng: number }) => data)
  .handler(async ({ data }) => {
    const user = await requireAuthRole({ data: 'donor' });
    
    // Save donation with pending_validation status
    const [donation] = await db.insert(donations).values({
      donorId: user.id,
      status: 'pending_validation',
      hardwareDetails: JSON.parse(data.hardwareDetails),
      photos: data.photos,
      location: [data.lng, data.lat], // PostGIS uses [lng, lat] for points
    }).returning();
    
    return donation;
  });

export const Route = createFileRoute('/donor/')({
  beforeLoad: async () => {
    try {
      await requireAuthRole({ data: 'donor' });
    } catch (e) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: DonorDashboard,
});

function DonorDashboard() {
  const [hardwareDetails, setHardwareDetails] = useState('{"type": "laptop", "brand": "Dell", "condition": "working"}');
  const [photos, setPhotos] = useState<string>('https://example.com/photo1.jpg');
  const [lat, setLat] = useState<number>(-34.6037);
  const [lng, setLng] = useState<number>(-58.3816);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const photosArray = photos.split(',').map(p => p.trim()).filter(Boolean);
    
    if (photosArray.length === 0) {
      setMessage('Error: Missing required baseline information (photos are mandatory).');
      return;
    }

    try {
      await submitDonationFn({
        data: {
          hardwareDetails,
          photos: photosArray,
          lat,
          lng,
        }
      });
      setMessage('Donation submitted successfully! Pending validation.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>
      <p className="mb-6">Submit a new hardware donation.</p>

      {message && (
        <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hardware Details (JSON)</label>
          <textarea 
            value={hardwareDetails}
            onChange={(e) => setHardwareDetails(e.target.value)}
            className="w-full border rounded p-2 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photos (comma separated URLs)</label>
          <input 
            type="text"
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input 
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input 
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}
