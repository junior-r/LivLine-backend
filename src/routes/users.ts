import { UserController } from '@/controllers/user'
import { requireAuth, requireRole } from '@/middlewares/auth'
import { UserModel } from '@/models/User'
import { Router } from 'express'

export const createUserRouter = () => {
  const router = Router()
  const controller = new UserController({ model: UserModel })

  router.get('/get-user-by-email-or-pk/:query', controller.getUserByEmailPkOrId)

  router.use(requireAuth)

  router.get('/', requireRole, controller.getAll)

  router.get('/me', controller.getCurrentUser)

  router.get('/:pk', controller.getUser)

  router.patch('/:pk', controller.update)

  // router.patch('/change-password/:pk', controller.changePassword)

  return router
}
