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
      setError('Por favor, selecciona una ubicación en el mapa');
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
      setError(err.message || 'Error en el registro');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-sumi-ink/80 backdrop-blur-md rounded-xl shadow-lg border border-white/10 text-fuji-white">
      <h1 className="text-2xl font-bold mb-4 text-spring-green">Registro</h1>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-fuji-white mb-2">Correo Electrónico</label>
          <input 
            type="email" 
            className="w-full border border-white/20 bg-sumi-ink/50 text-fuji-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-spring-green" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-fuji-white mb-2">Contraseña</label>
          <input 
            type="password" 
            className="w-full border border-white/20 bg-sumi-ink/50 text-fuji-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-spring-green" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-fuji-white mb-2">Rol</label>
          <select 
            className="w-full border border-white/20 bg-sumi-ink text-fuji-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-spring-green" 
            value={role} 
            onChange={(e) => setRole(e.target.value as 'donor' | 'technician')}
          >
            <option value="donor">Donante</option>
            <option value="technician">Técnico</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-fuji-white mb-2">Ubicación (Selecciona en el mapa)</label>
          <MapPicker onLocationSelect={(lat, lng) => setLocation([lat, lng])} />
          {location && (
            <p className="text-sm text-spring-green mt-2 font-mono">
              Coordenadas: {location[0].toFixed(4)}, {location[1].toFixed(4)}
            </p>
          )}
        </div>
        <button type="submit" className="w-full bg-spring-green text-sumi-ink font-bold p-3 rounded-lg hover:bg-spring-green/90 transition-colors shadow-[0_0_10px_var(--color-spring-green)]">
          Registrarse
        </button>
      </form>
    </div>
  );
}
