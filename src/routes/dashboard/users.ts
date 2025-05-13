import { DashboardUserController } from '@/controllers/dashboard/users'
import { DashboardUserModel } from '@/models/Dashboard/User'
import { Router } from 'express'

export const createDashboardUserRouter = () => {
  const router = Router()
  const controller = new DashboardUserController({ model: DashboardUserModel })

  router.post('/', controller.create)
  router.post('/:userPk', controller.createData)
  router.get('/:userPk', controller.getUser)

  return router
}
