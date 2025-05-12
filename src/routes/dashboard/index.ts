import { requireAuth, requireRole } from '@/middlewares/auth'
import { Router } from 'express'
import { createDashboardUserRouter } from './users'

export const dashboardRouter = () => {
  const dashboardRouter = Router()

  dashboardRouter.use(requireAuth)
  dashboardRouter.use(requireRole)

  dashboardRouter.use('/users', createDashboardUserRouter())

  return dashboardRouter
}
