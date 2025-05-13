import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'
import { SurgeryType } from '@/schemas/dashboard/medicalData/surgery'

const prisma = new PrismaClient()

export class SurgeryModel {
  static async create({ patientDataPk, data }: { patientDataPk: string; data: SurgeryType }) {
    try {
      const newObject = await prisma.surgery.create({
        data: {
          ...data,
          PatientData: { connect: { pk: patientDataPk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar registrar una cirugía')
    }
  }
}
