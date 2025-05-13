import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { validateAllergyCreation } from '@/schemas/dashboard/medicalData/allergy'
import { AllergyModel } from '@/models/Dashboard/MedicalData/Allergy'

export class DashboardAllergyController {
  private model: typeof AllergyModel

  constructor({ model }: { model: typeof AllergyModel }) {
    this.model = model
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patientDataPk } = req.params
      const result = validateAllergyCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ patientDataPk, data: result.data })
      res.status(201).send({ allergy: newObject, message: 'Alergia registrada correctamente' })
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
      res.send({ allergy: deletedObject, message: 'Alergia eliminada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
