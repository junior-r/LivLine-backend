import { DashboardUserController } from '@/controllers/dashboard/users'
import { DashboardUserModel } from '@/models/Dashboard/User'
import { Router } from 'express'

export const createDashboardUserRouter = () => {
  const usersRouter = Router()
  const usersController = new DashboardUserController({ model: DashboardUserModel })

  usersRouter.post('/', usersController.create)
  usersRouter.post('/:userPk', usersController.createData)
  usersRouter.get('/:userPk', usersController.getUser)

  return usersRouter
}
