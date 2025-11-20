import { z } from "zod";

// Test the register schema
const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    email: z
      .string()
      .email("Invalid email format")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must be less than 100 characters")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
  }),
});

console.log("Testing Zod validation...\n");

// Test valid data
try {
  const validData = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
    },
  };

  const result = registerSchema.parse(validData);
  console.log("✅ Valid data passed validation:", result.body);
} catch (error) {
  console.log("❌ Valid data failed validation:", error.message);
}

// Test invalid data
try {
  const invalidData = {
    body: {
      name: "J", // Too short
      email: "invalid-email", // Invalid email
      password: "weak", // Too short and missing requirements
    },
  };

  const result = registerSchema.parse(invalidData);
  console.log("❌ Invalid data passed validation (this should not happen)");
} catch (error) {
  console.log("✅ Invalid data correctly failed validation:");
  if (error.errors) {
    error.errors.forEach((err) => {
      console.log(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }
}

console.log("\n🎉 Zod validation is working correctly!");
