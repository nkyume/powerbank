import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { HTTPstatus } from '../routes/statusCodes'
import { SETTINGS } from '../settings'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.sendStatus(HTTPstatus.UNAUTHORIZED_401)
    return
  }
  try {
    const result = jwt.verify(token, SETTINGS.JWT_SECRET)
    res.locals.userDetails = result
    next()
  } catch (err) {
    res.sendStatus(HTTPstatus.UNAUTHORIZED_401)
  }
}
