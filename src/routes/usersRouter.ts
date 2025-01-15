import express, { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { limitValidation } from '../middleware/limitValidation'
import { pageValidation } from '../middleware/pageValidation'
import { userViewModel } from '../models/userViewModel'
import { findUser, findUsers } from '../services/usersService'
import { HTTPstatus } from './statusCodes'

export const userRouter = express.Router()

userRouter.get(
  '/',
  limitValidation,
  pageValidation,
  inputValidationMiddleware,
  async (
    req: Request<{}, {}, {}, { search: string }>,
    res: Response<userViewModel[]>
  ) => {
    const data = matchedData(req)
    const search = req.query.search || ''
    const limit = data.limit || 50
    const page = data.page || 1
    const skip = limit * (page - 1)

    const users = await findUsers(search, limit, skip)
    res.json(users)
  }
)

userRouter.get(
  '/:username',
  async (req: Request<{ username: string }>, res: Response<userViewModel>) => {
    if (!req.params.username) {
      res.status(HTTPstatus.BAD_REQUEST_400)
    }
    const user = await findUser(req.params.username)
    if (!user.username) {
      res.sendStatus(HTTPstatus.NOT_FOUND_404)
      return
    }
    res.json(user)
  }
)
