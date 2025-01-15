import { query } from 'express-validator'

export const pageValidation = query('page')
  .optional()
  .isInt()
  .withMessage('page must be an integer')
