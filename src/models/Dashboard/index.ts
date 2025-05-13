import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'

const prisma = new PrismaClient()

export class DashboardModel {
  static async getTotalUsers() {
    try {
      return await prisma.user.count()
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener el total de usuarios')
    }
  }

  static async getActiveUsers() {
    try {
      return await prisma.user.count({
        where: { isActive: true },
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener el total de usuarios')
    }
  }

  static async getUserGrowth() {
    try {
      const data = await prisma.$queryRaw<{ month: string; total: number }[]>`
        SELECT TO_CHAR(date_trunc('month', "createdAt"), 'YYYY-MM') as month, COUNT(*) as total
        FROM "User"
        GROUP BY month
        ORDER BY month ASC;
      `
      return data
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener el crecimiento de usuarios')
    }
  }

  static async getTotalPatientsWithAllergies() {
    try {
      return await prisma.allergy
        .groupBy({
          by: 'patientDataPk',
          _count: true,
        })
        .then((res) => res.length)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener pacientes con alergias')
    }
  }

  static async getBloodTypeDistribution() {
    try {
      const data = await prisma.patientData.groupBy({
        by: 'bloodType',
        _count: { bloodType: true },
      })
      return data.map((item) => ({
        type: item.bloodType,
        total: item._count.bloodType,
      }))
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener distribución de tipo de sangre')
    }
  }

  static async getSexDistribution() {
    try {
      const data = await prisma.patientData.groupBy({
        by: ['sex'],
        _count: { sex: true },
      })
      return data.map((item) => ({
        sex: item.sex,
        total: item._count.sex,
      }))
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener distribución por sexo')
    }
  }

  static async getMostCommonChronicConditions() {
    try {
      const data = await prisma.chronicCondition.groupBy({
        by: ['name'],
        _count: { name: true },
        orderBy: { _count: { name: 'desc' } },
        take: 5,
      })
      return data.map((item) => ({
        name: item.name,
        total: item._count.name,
      }))
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener enfermedades crónicas más comunes')
    }
  }

  static async getMostAdministeredVaccines() {
    try {
      const data = await prisma.vaccine.groupBy({
        by: ['name'],
        _count: { name: true },
        orderBy: { _count: { name: 'desc' } },
        take: 5,
      })
      return data.map((item) => ({
        name: item.name,
        total: item._count.name,
      }))
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al obtener vacunas más administradas')
    }
  }
}
