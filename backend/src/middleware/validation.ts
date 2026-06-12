import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware factory for validating payloads against Zod schemas.
 * Automatically checks req.body, req.query, and req.params fields.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body by default, or the composite request object if desired
      const parsed = await schema.parseAsync(req.body);
      
      // Update req.body with the parsed and sanitized details (transformations applied)
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        
        error.errors.forEach((err) => {
          const pathName = err.path.join('.');
          formattedErrors[pathName] = err.message;
        });

        res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }
      
      next(error);
    }
  };
};

/**
 * Optional variant for validating query parameters specifically
 */
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'fail',
          message: 'Query validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Optional variant for validating url path parameters specifically
 */
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'fail',
          message: 'Path validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
      }
      next(error);
    }
  };
};
