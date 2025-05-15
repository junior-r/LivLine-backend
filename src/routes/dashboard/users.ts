import { DashboardUserController } from '@/controllers/dashboard/users'
import { requireAuth, requireRole } from '@/middlewares/auth'
import { DashboardUserModel } from '@/models/Dashboard/User'
import { Router } from 'express'

export const createDashboardUserRouter = () => {
  const router = Router()
  const controller = new DashboardUserController({ model: DashboardUserModel })

  router.get('/:userPk', controller.getUser)

  router.use(requireAuth)
  router.use(requireRole)

  router.post('/', controller.create)
  router.patch('/:pk', controller.update)
  router.post('/:userPk', controller.createData)
  router.put('/:dataPk', controller.updateData)

  return router
}
