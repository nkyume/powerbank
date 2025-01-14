import { NextFunction, Request, Response } from 'express'

import { HTTPstatus } from '../routes/statusCodes'

export function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    res
      .status(HTTPstatus.SERVER_ERROR_500)
      .json({ error: 'Internal Server Error' })
  }
}
