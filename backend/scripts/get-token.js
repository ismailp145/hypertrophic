#!/usr/bin/env node

import jwt from "jsonwebtoken";

// This script generates a test JWT token
// In production, you would get tokens from login/register endpoints

const payload = {
  userId: 1,
  email: "test@example.com",
  name: "Test User",
};

const secret = process.env.JWT_SECRET || "your-super-secret-jwt-key-here";

const token = jwt.sign(payload, secret, { expiresIn: "24h" });

console.log("🔑 Test JWT Token:");
console.log(token);
console.log("\n📋 Usage:");
console.log(
  `curl -H "Authorization: Bearer ${token}" http://localhost:8080/api/users`
);
console.log(
  `curl -H "Authorization: Bearer ${token}" http://localhost:8080/api/workouts`
);
console.log("\n🔍 Decoded payload:");
console.log(JSON.stringify(payload, null, 2));
