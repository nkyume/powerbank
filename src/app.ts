import express from 'express'

import { authRouter } from './routes/authRouter'
import { balancesRouter } from './routes/balancesRouter'
import { userRouter } from './routes/usersRouter'

export const app = express()

app.use(express.json())
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/balance', balancesRouter)
