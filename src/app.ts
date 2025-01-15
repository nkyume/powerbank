import cors from 'cors'
import express from 'express'

import { authRouter } from './routes/authRouter'
import { balancesRouter } from './routes/balancesRouter'
import { userRouter } from './routes/usersRouter'

export const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/balance', balancesRouter)
