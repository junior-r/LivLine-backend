import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { AppointmentModel } from '@/models/Dashboard/MedicalData/Appointment'
import { validateAppointmentCreation } from '@/schemas/dashboard/medicalData/appointment'

export class DashboardAppointmentController {
  private model: typeof AppointmentModel

  constructor({ model }: { model: typeof AppointmentModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateAppointmentCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res.status(201).send({ appointment: newObject, message: 'Cita registrada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  delete = async (req: Request, res: Response) => {
    const { pk } = req.params

    try {
      const deletedObject = await this.model.delete({ pk })
      res.send({ appointment: deletedObject, message: 'Cita eliminada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
