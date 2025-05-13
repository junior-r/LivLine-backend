import { DashboardAppointmentController } from '@/controllers/dashboard/medicalData/appointments'
import { AppointmentModel } from '@/models/Dashboard/MedicalData/Appointment'
import { Router } from 'express'

export const createDashboardAppointmentsRouter = () => {
  const router = Router()
  const controller = new DashboardAppointmentController({ model: AppointmentModel })

  router.post('/:patientDataPk', controller.create)
  router.delete('/:pk', controller.delete)

  return router
}
