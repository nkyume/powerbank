import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import { HTTPstatus } from '../routes/statusCodes'

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(HTTPstatus.BAD_REQUEST_400).json({ errors: errors.array() })
  } else {
    next()
  }
}
