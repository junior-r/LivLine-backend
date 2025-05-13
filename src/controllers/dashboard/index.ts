import { Request, Response } from 'express'
import { AppError } from '@/utils/errors'
import { DashboardModel } from '@/models/Dashboard'

export class DashboardController {
  private model: typeof DashboardModel

  constructor({ model }: { model: typeof DashboardModel }) {
    this.model = model
  }

  getTotalUsers = async (_req: Request, res: Response) => {
    try {
      const total = await this.model.getTotalUsers()
      res.status(200).json({ total })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getTotalActiveUsers = async (_req: Request, res: Response) => {
    try {
      const total = await this.model.getActiveUsers()
      res.status(200).json({ total })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getUserGrowth = async (_req: Request, res: Response) => {
    try {
      const growth = await this.model.getUserGrowth()
      const parsedGrowth = growth.map((item) => ({
        month: item.month,
        total: Number(item.total),
      }))
      res.status(200).json({ growth: parsedGrowth })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getTotalPatientsWithAllergies = async (_req: Request, res: Response) => {
    try {
      const total = await this.model.getTotalPatientsWithAllergies()
      res.status(200).json({ total })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getBloodTypeDistribution = async (_req: Request, res: Response) => {
    try {
      const distribution = await this.model.getBloodTypeDistribution()
      res.status(200).json({ distribution })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getSexDistribution = async (_req: Request, res: Response) => {
    try {
      const distribution = await this.model.getSexDistribution()
      res.status(200).json({ distribution })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getMostCommonChronicConditions = async (_req: Request, res: Response) => {
    try {
      const conditions = await this.model.getMostCommonChronicConditions()
      res.status(200).json({ conditions })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getMostAdministeredVaccines = async (_req: Request, res: Response) => {
    try {
      const vaccines = await this.model.getMostAdministeredVaccines()
      res.status(200).json({ vaccines })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
