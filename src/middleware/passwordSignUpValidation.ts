import { body } from 'express-validator'

export const passwordSignUpValidation = body('password')
  .not()
  .isEmpty()
  .withMessage('password is required')
  .isString()
  .withMessage('password must be a string')
  .isLength({ min: 9, max: 72 })
  .withMessage('password must contain from 9 to 72 characters')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  .withMessage('password must contain at least 1 letter and 1 number')
