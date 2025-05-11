import { Router } from 'express'
import { AuthModel } from '@/models/Auth'
import { AuthController } from '@/controllers/auth'
import { requireAuth } from '@/middlewares/auth'

export const createAuthRouter = () => {
  const authRouter = Router()
  const authController = new AuthController({ model: AuthModel })

  authRouter.get('/', (_req, res) => {
    res.send('Auth route')
  })

  authRouter.post('/login', authController.login)

  authRouter.post('/register', authController.create)

  // authRouter.post('/reset-password', authController.resetPassword)

  // authRouter.post('/reset-password/confirm/:token', authController.resetPasswordConfirm)

  authRouter.post('/logout', requireAuth, authController.logout)

  return authRouter
}
