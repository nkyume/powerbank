import express, { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { passwordValidation } from '../middleware/passwordValidation'
import { usernameValidation } from '../middleware/usernameValidation'
import { userCreateModel } from '../models/userCreateModel'
import { userLoginModel } from '../models/userLoginModel'
import { createUser, loginUser } from '../services/authService'
import { findUser } from '../services/usersService'
import { HTTPstatus } from './statusCodes'

export const authRouter = express.Router()

authRouter.post(
  '/signup',
  usernameValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: Request<{}, userCreateModel>, res: Response) => {
    const data = matchedData(req)
    const isUserExists = await findUser(data.username)
    if (isUserExists.username) {
      res
        .status(HTTPstatus.CONFLICT_409)
        .json({ message: 'Username already taken.' })
      return
    }
    await createUser({ username: data.username, password: data.password })
    res.sendStatus(HTTPstatus.CREATED_201)
  }
)

authRouter.post(
  '/login',
  async (req: Request<{}, userLoginModel>, res: Response) => {
    const token = await loginUser({
      username: req.body.username,
      password: req.body.password,
    })
    if (!token) {
      res
        .status(HTTPstatus.UNAUTHORIZED_401)
        .json({ message: 'Invalid username or password.' })
    }
    res.json({ token: token })
  }
)