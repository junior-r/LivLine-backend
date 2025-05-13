import { Router } from 'express'
import { AuthModel } from '@/models/Auth'
import { AuthController } from '@/controllers/auth'
import { requireAuth } from '@/middlewares/auth'

export const createAuthRouter = () => {
  const router = Router()
  const controller = new AuthController({ model: AuthModel })

  router.get('/', (_req, res) => {
    res.send('Auth route')
  })

  router.post('/login', controller.login)

  router.post('/register', controller.create)

  // router.post('/reset-password', controller.resetPassword)

  // router.post('/reset-password/confirm/:token', controller.resetPasswordConfirm)

  router.post('/logout', requireAuth, controller.logout)

  return router
}
