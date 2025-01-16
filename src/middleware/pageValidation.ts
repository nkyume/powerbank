import { query } from 'express-validator'

export const pageValidation = query('page')
  .optional()
  .isInt({ min: 1 })
  .withMessage('page must be greather than 0')
