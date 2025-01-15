import { body } from 'express-validator'

export const usernameSignUpValidation = body('username')
  .notEmpty()
  .withMessage('username is requiered')
  .isString()
  .withMessage('username must be a string')
  .trim()
  .toLowerCase()
  .isLength({ min: 3, max: 30 })
  .withMessage('username must contain from 3 to 30 symbols')
  .matches(/^\w+\d?$/)
  .withMessage('username contains forbidden symbols')
  .not()
  .matches(/tiananmen/)
  .withMessage('-1000000 social credits')
