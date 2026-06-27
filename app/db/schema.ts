import { pgTable, uuid, varchar, text, jsonb, integer, geometry, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['donor', 'technician', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['pending_approval', 'active']);
export const donationStatusEnum = pgEnum('donation_status', [
  'pending_validation', 
  'accepted', 
  'pending_match', 
  'assigned',
  'in_progress', 
  'ready_to_deploy', 
  'unrepairable'
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
  status: userStatusEnum('status').notNull().default('pending_approval'),
  location: geometry('location', { type: 'point', mode: 'tuple', srid: 4326 }),
  maxCapacity: integer('max_capacity').default(0),
  currentLoad: integer('current_load').default(0),
});

export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  donorId: uuid('donor_id').references(() => users.id).notNull(),
  technicianId: uuid('technician_id').references(() => users.id),
  status: donationStatusEnum('status').notNull().default('pending_validation'),
  hardwareDetails: jsonb('hardware_details'),
  photos: text('photos').array(),
  location: geometry('location', { type: 'point', mode: 'tuple', srid: 4326 }),
  failureReason: text('failure_reason'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});


