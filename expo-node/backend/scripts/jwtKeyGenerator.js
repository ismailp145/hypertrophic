import crypto from "crypto";
const secretKey = crypto.randomBytes(32).toString("hex");

console.log(secretKey);

// run with node scripts/jwtKeyGenerator.js
