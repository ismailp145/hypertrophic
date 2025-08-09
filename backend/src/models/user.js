"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.users = void 0;
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../config/database");
// Export the users table from schema
exports.users = schema_1.usersTable;
// User model functions
exports.UserModel = {
    // Get all users
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.db.select().from(schema_1.usersTable);
    }),
    // Get user by ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
        return result[0] || null;
    }),
    // Get user by email
    findByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
        return result[0] || null;
    }),
    // Create new user
    create: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.db.insert(schema_1.usersTable).values(userData).returning();
        return result[0];
    }),
    // Update user
    update: (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.db.update(schema_1.usersTable)
            .set(userData)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id))
            .returning();
        return result[0] || null;
    }),
    // Delete user
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.db.delete(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id))
            .returning();
        return result[0] || null;
    })
};
