import { DashboardVaccineController } from '@/controllers/dashboard/medicalData/vaccines'
import { VaccineModel } from '@/models/Dashboard/MedicalData/Vaccine'
import { Router } from 'express'

export const createDashboardVaccinesRouter = () => {
  const router = Router()
  const controller = new DashboardVaccineController({ model: VaccineModel })

  router.post('/:patientDataPk', controller.create)
  router.delete('/:pk', controller.delete)

  return router
}
