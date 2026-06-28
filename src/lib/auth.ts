import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			role: attributes.role,
			status: attributes.status
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	role: 'donor' | 'technician' | 'admin';
	status: 'pending_approval' | 'active';
}

export const getAuthSession = createServerFn({ method: "GET" }).handler(async () => {
	const sessionId = getCookie(lucia.sessionCookieName);
	if (!sessionId) {
		return { user: null, session: null };
	}

	const result = await lucia.validateSession(sessionId);
	try {
		if (result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// ignore
	}
	return result;
});

export const requireAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await getAuthSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
});

export const requireAuthRole = createServerFn({ method: "GET" })
  .validator((role: 'donor' | 'technician' | 'admin') => role)
  .handler(async ({ data: requiredRole }) => {
    const { user } = await getAuthSession();
    if (!user) {
      throw new Error("Unauthorized");
    }
    if (user.role !== requiredRole) {
      throw new Error("Forbidden");
    }
    return user;
  });

