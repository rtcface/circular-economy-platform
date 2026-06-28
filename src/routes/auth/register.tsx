import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { createServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '../../lib/auth';
import { setCookie } from '@tanstack/react-start/server';
import { Scrypt } from 'oslo/password';
import { MapPicker } from '../../components/MapPicker';

const registerUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; role: 'donor' | 'technician' | 'admin', location?: [number, number] }) => data)
  .handler(async ({ data }) => {
    const { email, password, role, location } = data;
    
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await new Scrypt().hash(password);

    const [newUser] = await db.insert(users).values({
      email,
      passwordHash,
      role,
      status: role === 'donor' ? 'active' : 'pending_approval',
      location: location || null,
    }).returning();

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    return { success: true, role: newUser.role };
  });

export const Route = createFileRoute('/auth/register')({
  component: Register,
});

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'technician'>('donor');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a location on the map');
      return;
    }
    
    try {
      const result = await registerUser({ data: { email, password, role, location: [location[1], location[0]] } }); // store as [lng, lat] for PostGIS
      if (result.success) {
        if (result.role === 'technician') {
          navigate({ to: '/technician' });
        } else {
          navigate({ to: '/donor' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            className="w-full border p-2 rounded" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Role</label>
          <select 
            className="w-full border p-2 rounded" 
            value={role} 
            onChange={(e) => setRole(e.target.value as 'donor' | 'technician')}
          >
            <option value="donor">Donor</option>
            <option value="technician">Technician</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Location</label>
          <MapPicker onLocationSelect={(lat, lng) => setLocation([lat, lng])} />
          {location && (
            <p className="text-sm text-green-600 mt-2">
              Location selected: {location[0].toFixed(4)}, {location[1].toFixed(4)}
            </p>
          )}
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
