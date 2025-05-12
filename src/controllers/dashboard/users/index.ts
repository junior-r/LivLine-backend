import { DashboardUserModel } from '@/models/Dashboard/User'
import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { validateUserCreation } from '@/schemas/dashboard/user'

export class DashboardUserController {
  private model: typeof DashboardUserModel

  constructor({ model }: { model: typeof DashboardUserModel }) {
    this.model = model
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
      console.log(error)
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
      return
    }
    return
  }
}
