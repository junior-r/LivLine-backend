import { DashboardMedicationController } from '@/controllers/dashboard/medicalData/medication'
import { MedicationModel } from '@/models/Dashboard/MedicalData/Medication'
import { Router } from 'express'

export const createDashboardMedicationsRouter = () => {
  const router = Router()
  const controller = new DashboardMedicationController({ model: MedicationModel })

  router.post('/:patientDataPk', controller.create)
  router.delete('/:pk', controller.delete)

  return router
}
