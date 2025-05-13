import { PrismaClient } from '@prisma/client'
import { AppError, ServerError } from '@/utils/errors'
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
}
