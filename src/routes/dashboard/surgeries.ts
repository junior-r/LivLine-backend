import { DashboardSurgeryController } from '@/controllers/dashboard/medicalData/surgeries'
import { SurgeryModel } from '@/models/Dashboard/MedicalData/Surgery'
import { Router } from 'express'

export const createDashboardSurgeriesRouter = () => {
  const router = Router()
  const controller = new DashboardSurgeryController({ model: SurgeryModel })

  router.post('/:patientDataPk', controller.create)

  return router
}
