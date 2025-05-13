import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
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
      throw new ServerError('Error al intentar registrar una vacuna')
    }
  }

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.vaccine.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Vacuna no encontrada')

      const deleted = await prisma.vaccine.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la vacuna')
    }
  }
}
