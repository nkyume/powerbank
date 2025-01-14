import { body } from 'express-validator'

export const usernameValidation = body('username')
  .not()
  .isEmpty()
  .withMessage('Username is requiered.')
  .isString()
  .withMessage('Username must be a string.')
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must contain from 3 to 30 symbols.')
  .matches(/^\w+\d?$/)
  .withMessage('Username contains forbidden symbols.')
  .not()
  .matches(/tiananmen/)
  .withMessage('-1000000 social credits')
