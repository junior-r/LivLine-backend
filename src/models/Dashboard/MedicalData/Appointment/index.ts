import { PrismaClient } from '@prisma/client'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'
import { AppointmentType } from '@/schemas/dashboard/medicalData/appointment'

const prisma = new PrismaClient()

export class AppointmentModel {
  static async create({ patientDataPk, data }: { patientDataPk: string; data: AppointmentType }) {
    try {
      const newObject = await prisma.appointment.create({
        data: {
          ...data,
          PatientData: { connect: { pk: patientDataPk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar registrar la cita')
    }
  }

  static async delete({ pk }: { pk: string }) {
    try {
      const object = await prisma.appointment.findUnique({
        where: { pk },
      })

      if (!object) throw new NotFoundError('Cita no encontrada')

      const deleted = await prisma.appointment.delete({
        where: { pk },
      })

      return deleted
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar eliminar la cita')
    }
  }
}
