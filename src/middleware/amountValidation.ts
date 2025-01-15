import { body } from 'express-validator'

export const amountValidation = body('amount')
  .notEmpty()
  .withMessage('amount is required')
  .isInt()
  .withMessage('amount must be an integer')
