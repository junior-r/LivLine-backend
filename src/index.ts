import 'module-alias/register'
import express from 'express'
import { config } from './config'
import { corsMiddleware } from './middlewares/cors'
import cookieParser from 'cookie-parser'
import { createAuthRouter } from './routes/auth'
import { authMiddleware } from './middlewares/auth'
import { createUserRouter } from './routes/users'
import { dashboardRouter } from './routes/dashboard'
import { contactRouter } from './routes/contacts'

const { PORT } = config

const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => authMiddleware(req, res, next))

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.use('/contacts', contactRouter())

app.use('/auth', createAuthRouter())
app.use('/users', createUserRouter())
app.use('/dashboard', dashboardRouter())

app.use((_req, res, _next) => {
  res.status(404).json({ error: 'Not Found' })
  return
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
