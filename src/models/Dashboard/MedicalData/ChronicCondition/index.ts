import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'
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
}
