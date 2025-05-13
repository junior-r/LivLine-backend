import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
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

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.surgery.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Cirugía no encontrada')

      const deleted = await prisma.surgery.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la cirugía')
    }
  }
}
