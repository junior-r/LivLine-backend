import { requireAuth, requireRole } from '@/middlewares/auth'
import { Router } from 'express'
import { createDashboardUserRouter } from './users'
import { createDashboardAllergyRouter } from './allergies'
import { createDashboardAppointmentsRouter } from './appointments'
import { createDashboardSurgeriesRouter } from './surgeries'
import { createDashboardChronicConditionRouter } from './chronicConditions'
import { createDashboardMedicationsRouter } from './medications'
import { createDashboardVaccinesRouter } from './vaccines'
import { createDashboardStatsRouter } from './stats'

export const dashboardRouter = () => {
  const router = Router()

  router.use('/users', createDashboardUserRouter())

  router.use(requireAuth)
  router.use(requireRole)

  router.use('/allergies', createDashboardAllergyRouter())
  router.use('/appointments', createDashboardAppointmentsRouter())
  router.use('/surgeries', createDashboardSurgeriesRouter())
  router.use('/chronicConditions', createDashboardChronicConditionRouter())
  router.use('/medications', createDashboardMedicationsRouter())
  router.use('/vaccines', createDashboardVaccinesRouter())
  router.use('/stats', createDashboardStatsRouter())

  return router
}
