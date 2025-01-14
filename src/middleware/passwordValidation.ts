import { body } from 'express-validator'

export const passwordValidation = body('password')
  .not()
  .isEmpty()
  .isString()
  .withMessage('Password must be a string')
  .isLength({ min: 9, max: 72 })
  .withMessage('Password must contain from 9 to 72 characters.')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  .withMessage('Password must contain at least 1 letter and 1 number.')
