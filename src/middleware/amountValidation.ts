import { body } from 'express-validator'

export const amountValidation = body('amount')
  .notEmpty()
  .withMessage('amount is required')
  .isInt({ min: 1 })
  .withMessage('amount must be an integer and greater than 0')
