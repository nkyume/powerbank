import { query } from 'express-validator'

export const limitValidation = query('limit')
  .optional()
  .isInt()
  .withMessage('limit must be an integer')
