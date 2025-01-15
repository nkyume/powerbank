import { body } from 'express-validator'

export const amountValidation = body('amount')
  .notEmpty()
  .withMessage('amount is required.')
  .isNumeric()
  .withMessage('amount must be a number.')
