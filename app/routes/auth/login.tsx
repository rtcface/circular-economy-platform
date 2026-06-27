import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { createServerFn } from '@tanstack/start';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '../../lib/auth';
import { setCookie } from 'vinxi/http';
import { Scrypt } from 'oslo/password';

const loginUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;
    
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await new Scrypt().verify(existingUser.passwordHash, password);
    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    return { success: true, role: existingUser.role };
  });

export const Route = createFileRoute('/auth/login')({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser({ data: { email, password } });
      if (result.success) {
        if (result.role === 'admin') {
          navigate({ to: '/admin' });
        } else if (result.role === 'technician') {
          navigate({ to: '/technician' });
        } else {
          navigate({ to: '/donor' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
