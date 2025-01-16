import { query } from 'express-validator'

export const pageValidation = query('page')
  .optional()
  .isInt({ min: 0 })
  .withMessage('page must be a positive integer')
