import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { validateSurgeryCreation } from '@/schemas/dashboard/medicalData/surgery'
import { SurgeryModel } from '@/models/Dashboard/MedicalData/Surgery'

export class DashboardSurgeryController {
  private model: typeof SurgeryModel

  constructor({ model }: { model: typeof SurgeryModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateSurgeryCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res.status(201).send({ surgery: newObject, message: 'Cirugía registrada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }
}
