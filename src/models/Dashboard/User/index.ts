import { Prisma, PrismaClient } from '@prisma/client'
import { config } from '@/config'
import { AppError, ConflictError, NotFoundError, ServerError } from '@/utils/errors'
import { UserCreateType, UserUpdateType } from '@/schemas/dashboard/user'
import bcrypt from 'bcryptjs'
import { generateSecurePassword } from '@/utils/generateSecurePassword'
import {
  MedicalDataType,
  MedicalDataUpdateType,
  UserBloodTypeOptions,
  UserSexOptions,
} from '@/schemas/dashboard/medicalData'
import { getEnumKeyByLabel } from '@/utils/getEnumKeyByLabel'
import { getDataForUpdate } from '@/utils/getDataForUpdate'

const prisma = new PrismaClient()
const { SALT_ROUNDS, PASSWORDS_CHARSET } = config

export class DashboardUserModel {
  static async getUser({ pk }: { pk: string }) {
    try {
      const object = await prisma.user.findUnique({ where: { pk }, omit: { password: true } })
      if (!object) throw new NotFoundError('Usuario no existe')
      const patientData = await prisma.patientData.findUnique({
        where: { userId: object.pk },
        include: {
          allergies: {
            orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
          },
          surgeries: {
            orderBy: [{ createdAt: 'desc' }],
          },
          chronicConditions: {
            orderBy: [{ createdAt: 'desc' }],
          },
          appointments: {
            orderBy: [{ createdAt: 'desc' }],
          },
          medications: {
            orderBy: [{ createdAt: 'desc' }],
          },
          vaccines: {
            orderBy: [{ createdAt: 'desc' }],
          },
        },
      })
      return [object, patientData]
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar crear usuario')
    }
  }

  static async create({ data }: { data: UserCreateType }) {
    try {
      const plainPassword = generateSecurePassword(PASSWORDS_CHARSET)
      const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS)
      const newObject = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      const { password, ...restData } = newObject
      return restData
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictError('El usuario ya existe')
        }
      }
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar crear usuario')
    }
  }

  static async update({ pk, data }: { pk: string; data: UserUpdateType }) {
    const newData = getDataForUpdate(data)
    try {
      const getObject = await prisma.user.findUnique({ where: { pk } })
      if (!getObject) throw new NotFoundError('Usuario no encontrada')

      const updated = await prisma.user.update({
        where: { pk: getObject.pk },
        data: newData,
      })

      return updated
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar actualizar la información')
    }
  }

  static async createMedicalData({ pk, data }: { pk: string; data: MedicalDataType }) {
    try {
      const newObject = await prisma.patientData.create({
        data: {
          ...data,
          sex: getEnumKeyByLabel(UserSexOptions, data.sex),
          bloodType: getEnumKeyByLabel(UserBloodTypeOptions, data.bloodType),
          user: { connect: { pk } },
        },
      })
      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar crear usuario')
    }
  }

  static async updateMedicalData({ pk, data }: { pk: string; data: MedicalDataUpdateType }) {
    const newData = getDataForUpdate(data)
    try {
      const getObject = await prisma.patientData.findUnique({ where: { pk } })
      if (!getObject) throw new NotFoundError('Información no encontrada')

      const updated = await prisma.patientData.update({
        where: { pk: getObject.pk },
        data: newData,
      })

      return updated
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar actualizar la información')
    }
  }
}
