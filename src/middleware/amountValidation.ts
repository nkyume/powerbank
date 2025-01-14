import { body } from 'express-validator'

export const amountValidation = body('amount')
  .notEmpty()
  .withMessage('amount should not be empty.')
  .isNumeric()
  .withMessage('amount should be a number.')
