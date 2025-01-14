import express, { Request, Response } from 'express'

import { userViewModel } from '../models/userViewModel'
import { findUser, findUsers } from '../services/usersService'
import { HTTPstatus } from './statusCodes'

export const userRouter = express.Router()

userRouter.get(
  '/',
  async (
    req: Request<{}, {}, {}, { search: string; limit: string; page: string }>,
    res: Response<userViewModel[]>
  ) => {
    const search = req.query.search || ''
    const limit = +req.query.limit || 50
    const page = +req.query.page || 1
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
