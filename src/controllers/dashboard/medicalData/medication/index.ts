import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { MedicationModel } from '@/models/Dashboard/MedicalData/Medication'
import { validateMedicationCreation } from '@/schemas/dashboard/medicalData/medication'

export class DashboardMedicationController {
  private model: typeof MedicationModel

  constructor({ model }: { model: typeof MedicationModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateMedicationCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res
        .status(201)
        .send({ medication: newObject, message: 'Medicación registrada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  delete = async (req: Request, res: Response) => {
    const { pk } = req.params

    try {
      const deletedObject = await this.model.delete({ pk })
      res.send({ medication: deletedObject, message: 'Medicación eliminada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
