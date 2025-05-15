import { DashboardUserModel } from '@/models/Dashboard/User'
import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { validateUserCreation, validateUserUpdate } from '@/schemas/dashboard/user'
import {
  validateMedicalDataCreation,
  validateMedicalDataEdition,
} from '@/schemas/dashboard/medicalData'

export class DashboardUserController {
  private model: typeof DashboardUserModel

  constructor({ model }: { model: typeof DashboardUserModel }) {
    this.model = model
  }

  getUser = async (req: Request, res: Response) => {
    try {
      const { userPk } = req.params

      const [user, data] = await this.model.getUser({ pk: userPk })
      res.status(200).send({ user: user, medicalData: data })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = validateUserCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newObject = await this.model.create({ data: result.data })
      res.status(201).send({ user: newObject, message: 'Usuario creado correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  update = async (req: Request, res: Response) => {
    try {
      const { pk } = req.params
      const data = req.body
      const result = validateUserUpdate(data)

      if (!result.success) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const updatedObject = await this.model.update({ pk, data: result.data })

      res
        .status(200)
        .send({ updatedUser: updatedObject, message: 'Información actualizada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  createData = async (req: Request, res: Response) => {
    try {
      const { userPk } = req.params
      const result = validateMedicalDataCreation(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const newMedicalData = await this.model.createMedicalData({ pk: userPk, data: result.data })
      res.status(201).send({ data: newMedicalData, message: 'Datos médicos creados correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  updateData = async (req: Request, res: Response) => {
    try {
      const { dataPk } = req.params
      const data = req.body
      const result = validateMedicalDataEdition(data)

      if (!result.success) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const updatedObject = await this.model.updateMedicalData({ pk: dataPk, data: result.data })

      res
        .status(200)
        .send({ data: updatedObject, message: 'Información actualizada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
