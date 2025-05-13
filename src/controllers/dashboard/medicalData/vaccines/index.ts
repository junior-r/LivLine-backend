import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { VaccineModel } from '@/models/Dashboard/MedicalData/Vaccine'
import { validateVaccineCreation } from '@/schemas/dashboard/medicalData/vaccine'

export class DashboardVaccineController {
  private model: typeof VaccineModel

  constructor({ model }: { model: typeof VaccineModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateVaccineCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res.status(201).send({ vaccine: newObject, message: 'Vacuna registrada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }
}
