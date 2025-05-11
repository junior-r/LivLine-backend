import { UserController } from '@/controllers/user'
import { requireAuth, requireRole } from '@/middlewares/auth'
import { UserModel } from '@/models/User'
import { Router } from 'express'

export const createUserRouter = () => {
  const usersRouter = Router()
  const userController = new UserController({ model: UserModel })

  usersRouter.use(requireAuth)

  usersRouter.get('/', requireRole, userController.getAll)

  usersRouter.get('/me', userController.getCurrentUser)

  usersRouter.get('/:pk', userController.getUser)

  usersRouter.patch('/:pk', userController.update)

  return usersRouter
}
