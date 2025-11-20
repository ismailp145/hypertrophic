import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Generic validation middleware that accepts any Zod schema
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request against the schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // If validation passes, continue to the next middleware/controller
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors for better user experience
        const errors = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
          errorType: 'VALIDATION_ERROR'
        });
      }
      
      // If it's not a Zod error, pass it to the error handler
      next(error);
    }
  };
};

// Helper function to extract validation errors for specific fields
export const getFieldError = (errors: any[], field: string): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
}; 