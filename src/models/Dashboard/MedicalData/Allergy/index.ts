import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
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

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.allergy.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Alergia no encontrada')

      const deleted = await prisma.allergy.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la alergia')
    }
  }
}
