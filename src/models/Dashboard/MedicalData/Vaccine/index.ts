import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'
import { VaccineType } from '@/schemas/dashboard/medicalData/vaccine'

const prisma = new PrismaClient()

export class VaccineModel {
  static async create({ patientDataPk, data }: { patientDataPk: string; data: VaccineType }) {
    try {
      const newObject = await prisma.vaccine.create({
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
