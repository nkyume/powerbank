import { body } from 'express-validator'

export const passwordLoginValidation = body('password')
  .notEmpty()
  .withMessage('password must not be empty')
  .isString()
  .withMessage('password must be a string')
