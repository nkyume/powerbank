import express, { Request, Response } from 'express'
import { body, matchedData } from 'express-validator'

import { amountValidation } from '../middleware/amountValidation'
import { authMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { balanceViewModel } from '../models/balanceViewModel'
import { transactionViewModel } from '../models/transactionViewModel'
import {
  bablo,
  deposit,
  findBalance,
  findTransacitons,
  transfer,
  withdraw,
} from '../services/balancesService'
import { findUser } from '../services/usersService'
import { HTTPstatus } from './statusCodes'

export const balancesRouter = express.Router()
balancesRouter.use(authMiddleware)

balancesRouter.get(
  '/',
  async (req: Request, res: Response<balanceViewModel>) => {
    const username = res.locals.userDetails.username
    const balance = await findBalance(username)
    res.json(balance)
  }
)

balancesRouter.get(
  '/transactions',
  async (req: Request, res: Response<transactionViewModel[]>) => {
    const username = res.locals.userDetails.username
    const transactions = await findTransacitons(username)
    res.json(transactions)
  }
)

balancesRouter.post(
  '/deposit',
  amountValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const data = matchedData(req)
    const username = res.locals.userDetails.username
    const balance = await findBalance(username)
    if (balance.cash - data.amount < 0) {
      res
        .status(HTTPstatus.UNPROCESSABLE_CONTENT_422)
        .json('Not enough money in wallet.')
      return
    }
    await deposit(username, data.amount)
    delete res.locals.userDetails
    res.sendStatus(HTTPstatus.NO_CONTENT_204)
  }
)

balancesRouter.post(
  '/withdraw',
  amountValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const data = matchedData(req)
    const username = res.locals.userDetails.username
    const balance = await findBalance(username)

    if (balance.non_cash - data.amount < 0) {
      res
        .status(HTTPstatus.UNPROCESSABLE_CONTENT_422)
        .json('Not enough money on bank balance.')
      return
    }
    await withdraw(username, data.amount)
    delete res.locals.userDetails
    res.sendStatus(HTTPstatus.NO_CONTENT_204)
  }
)

balancesRouter.post(
  '/transfer',
  amountValidation,
  body('receiver').notEmpty().withMessage('receiver should not be empty.'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const data = matchedData(req)
    const foundReceiver = await findUser(data.receiver)
    const username = res.locals.userDetails.username
    const balance = await findBalance(username)
    if (balance.non_cash - data.amount < 0) {
      res
        .status(HTTPstatus.UNPROCESSABLE_CONTENT_422)
        .json('Not enough money on bank balance.')
      return
    }
    if (!foundReceiver.username) {
      res.status(HTTPstatus.BAD_REQUEST_400).json("Receiver don't exist.")
      console.log(foundReceiver.username)
      console.log(data.receiver)
      return
    }
    await transfer(username, data.receiver, data.amount)
    delete res.locals.userDetails
    res.sendStatus(HTTPstatus.NO_CONTENT_204)
  }
)

balancesRouter.post(
  '/bablo',
  authMiddleware,
  amountValidation,
  inputValidationMiddleware,
  async (req: Request<{}, { amount: string }>, res: Response) => {
    const data = matchedData(req)
    await bablo(res.locals.userDetails.username, data.amount)
    delete res.locals.userDetails
    res.sendStatus(HTTPstatus.NO_CONTENT_204)
  }
)
