import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
import { ChronicConditionType } from '@/schemas/dashboard/medicalData/chronicCondition'

const prisma = new PrismaClient()

export class ChronicConditionModel {
  static async create({
    patientDataPk,
    data,
  }: {
    patientDataPk: string
    data: ChronicConditionType
  }) {
    try {
      const newObject = await prisma.chronicCondition.create({
        data: {
          ...data,
          PatientData: { connect: { pk: patientDataPk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar registrar la condición crónica')
    }
  }

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.chronicCondition.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Condición crónica no encontrada')

      const deleted = await prisma.chronicCondition.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la condición crónica')
    }
  }
}
