import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';

// Export the users table from schema
export const users = usersTable;

// Type for creating a new user (without id since it's auto-generated)
export type NewUser = typeof usersTable.$inferInsert;

// Type for a complete user record
export type User = typeof usersTable.$inferSelect;

// User model functions
export const UserModel = {
  // Get all users
  findAll: async () => {
    return await db.select().from(usersTable);
  },

  // Get user by ID
  findById: async (id: number) => {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return result[0] || null;
  },

  // Get user by email
  findByEmail: async (email: string) => {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return result[0] || null;
  },

  // Create new user
  create: async (userData: NewUser) => {
    const result = await db.insert(usersTable).values(userData).returning();
    return result[0];
  },

  // Update user
  update: async (id: number, userData: Partial<NewUser>) => {
    const result = await db.update(usersTable)
      .set(userData)
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] || null;
  },

  // Delete user
  delete: async (id: number) => {
    const result = await db.delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] || null;
  }
};
