import { Router } from 'express'
import { DashboardModel } from '@/models/Dashboard'
import { DashboardController } from '@/controllers/dashboard'

export const createDashboardStatsRouter = () => {
  const router = Router()
  const controller = new DashboardController({ model: DashboardModel })

  router.get('/total-users', controller.getTotalUsers)
  router.get('/total-active-users', controller.getTotalActiveUsers)
  router.get('/user-growth', controller.getUserGrowth)
  router.get('/patients-with-allergies', controller.getTotalPatientsWithAllergies)
  router.get('/blood-type-distribution', controller.getBloodTypeDistribution)
  router.get('/sex-distribution', controller.getSexDistribution)
  router.get('/most-common-chronic-conditions', controller.getMostCommonChronicConditions)
  router.get('/most-administered-vaccines', controller.getMostAdministeredVaccines)

  return router
}
