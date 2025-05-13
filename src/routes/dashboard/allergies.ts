import { DashboardAllergyController } from '@/controllers/dashboard/medicalData/allergies'
import { AllergyModel } from '@/models/Dashboard/MedicalData/Allergy'
import { Router } from 'express'

export const createDashboardAllergyRouter = () => {
  const router = Router()
  const controller = new DashboardAllergyController({ model: AllergyModel })

  router.post('/:patientDataPk', controller.create)
  router.delete('/:pk', controller.delete)

  return router
}
