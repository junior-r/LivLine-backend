import { UserController } from '@/controllers/user'
import { requireAuth, requireRole } from '@/middlewares/auth'
import { UserModel } from '@/models/User'
import { Router } from 'express'

export const createUserRouter = () => {
  const router = Router()
  const controller = new UserController({ model: UserModel })

  router.post('/get-user-by-email-or-pk', controller.getUserByEmailPkOrId)
  router.post('/verify-user-id/:pk/', controller.verifyIdNumber)

  router.use(requireAuth)

  router.get('/', requireRole, controller.getAll)

  router.get('/me', controller.getCurrentUser)

  router.get('/:pk', controller.getUser)

  router.patch('/:pk', controller.update)

  router.patch('/change-password/:pk', async (req, res) => {
    return controller.changePassword(req, res)
  })

  return router
}
