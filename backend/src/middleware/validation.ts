import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    const body = req.body;
    
    rules.forEach(rule => {
      const value = body[rule.field];
      
      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        return;
      }
      
      // Skip validation if value is not provided and not required
      if (value === undefined || value === null) {
        return;
      }
      
      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rule.field} must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push(`${rule.field} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${rule.field} must be a boolean`);
            }
            break;
          case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof value !== 'string' || !emailPattern.test(value)) {
              errors.push(`${rule.field} must be a valid email`);
            }
            break;
        }
      }
      
      // Length validation for strings
      if (rule.type === 'string' || typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
        }
      }
      
      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Common validation rules
export const userValidationRules: ValidationRule[] = [
  { field: 'email', required: true, type: 'email' },
  { field: 'password', required: true, type: 'string', minLength: 6 },
  { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 50 }
];

export const workoutValidationRules: ValidationRule[] = [
  { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 100 },
  { field: 'duration', required: false, type: 'number' },
  { field: 'type', required: false, type: 'string' }
]; 