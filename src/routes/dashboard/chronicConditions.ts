import { DashboardChronicConditionController } from '@/controllers/dashboard/medicalData/chronicCondition'
import { ChronicConditionModel } from '@/models/Dashboard/MedicalData/ChronicCondition'
import { Router } from 'express'

export const createDashboardChronicConditionRouter = () => {
  const router = Router()
  const controller = new DashboardChronicConditionController({ model: ChronicConditionModel })

  router.post('/:patientDataPk', controller.create)

  return router
}
