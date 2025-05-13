import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
import { MedicationType } from '@/schemas/dashboard/medicalData/medication'

const prisma = new PrismaClient()

export class MedicationModel {
  static async create({ patientDataPk, data }: { patientDataPk: string; data: MedicationType }) {
    try {
      const newObject = await prisma.medication.create({
        data: {
          ...data,
          PatientData: { connect: { pk: patientDataPk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar registrar la medicación')
    }
  }

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.medication.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Medicación no encontrada')

      const deleted = await prisma.medication.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la medicación')
    }
  }
}
