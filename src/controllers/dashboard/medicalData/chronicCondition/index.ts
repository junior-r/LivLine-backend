import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { validateChronicConditionCreation } from '@/schemas/dashboard/medicalData/chronicCondition'
import { ChronicConditionModel } from '@/models/Dashboard/MedicalData/ChronicCondition'

export class DashboardChronicConditionController {
  private model: typeof ChronicConditionModel

  constructor({ model }: { model: typeof ChronicConditionModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateChronicConditionCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res
        .status(201)
        .send({ condition: newObject, message: 'Condición crónica registrada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }
}
