import { query } from 'express-validator'

export const limitValidation = query('limit')
  .optional()
  .isInt({ min: 0, max: 100 })
  .withMessage('limit must be a positive integer with max value 100')
