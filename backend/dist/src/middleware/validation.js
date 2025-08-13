var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ZodError } from 'zod';
// Generic validation middleware that accepts any Zod schema
export const validate = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate the request against the schema
            yield schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // If validation passes, continue to the next middleware/controller
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors for better user experience
                const errors = error.errors.map((err) => ({
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
    });
};
// Helper function to extract validation errors for specific fields
export const getFieldError = (errors, field) => {
    const error = errors.find(err => err.field === field);
    return error === null || error === void 0 ? void 0 : error.message;
};
