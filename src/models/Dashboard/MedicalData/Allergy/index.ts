import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'
import { AllergyType } from '@/schemas/dashboard/medicalData/allergy'

const prisma = new PrismaClient()

export class AllergyModel {
  static async create({ patientDataPk, data }: { patientDataPk: string; data: AllergyType }) {
    try {
      const newObject = await prisma.allergy.create({
        data: {
          ...data,
          PatientData: { connect: { pk: patientDataPk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar crear alergia')
    }
  }
}
