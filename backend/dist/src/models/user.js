var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
// Export the users table from schema
export const users = usersTable;
// User model functions
export const UserModel = {
    // Get all users
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield db.select().from(usersTable);
    }),
    // Get user by ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.select().from(usersTable).where(eq(usersTable.id, id));
        return result[0] || null;
    }),
    // Get user by email
    findByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.select().from(usersTable).where(eq(usersTable.email, email));
        return result[0] || null;
    }),
    // Create new user
    create: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.insert(usersTable).values(userData).returning();
        return result[0];
    }),
    // Update user
    update: (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.update(usersTable)
            .set(userData)
            .where(eq(usersTable.id, id))
            .returning();
        return result[0] || null;
    }),
    // Delete user
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();
        return result[0] || null;
    })
};
