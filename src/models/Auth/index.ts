import { config } from '@/config'
import { Prisma, PrismaClient } from '@prisma/client'
import { User as UserType } from '@/schemas/user'
import bcrypt from 'bcryptjs'
import {
  AppError,
  ConflictError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from '@/utils/errors'
import crypto from 'node:crypto'

const { SALT_ROUNDS } = config
const prisma = new PrismaClient()

export class AuthModel {
  static async create({ data }: { data: UserType }) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
    try {
      const newObject = await prisma.user.create({
        data: {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
        },
      })
      return {
        pk: newObject.pk,
        email: newObject.email,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictError('El usuario ya existe')
        }
      }
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar crear el usuario')
    }
  }

  static async loginByEmail({ email, checkPassword }: { email: string; checkPassword?: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) throw new NotFoundError('Usuario no encontrado')

      const { password, ...restData } = user
      if (checkPassword) {
        const isValidPassword = await bcrypt.compare(checkPassword, password)
        if (!isValidPassword) throw new UnauthorizedError('Contraseña incorrecta')
      }
      return restData
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar obtener al usuario')
    }
  }

  static async resetPasswordCreate({ userEmail }: { userEmail: string }) {
    try {
      const newResetCode = 'RSC-' + crypto.randomBytes(4).toString('hex').toUpperCase()
      const newObject = await prisma.resetPassword.create({
        data: {
          code: newResetCode,
          expiredAt: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
          user: { connect: { email: userEmail } },
        },
      })

      return newObject
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al crear el código de seguridad para el reset de la contraseña')
    }
  }

  static async resetPasswordValidate({ code }: { code: string }) {
    try {
      const resetCode = await prisma.resetPassword.findUnique({
        where: { code },
        include: { user: { omit: { password: true } } },
      })
      if (!resetCode) throw new NotFoundError('Código de seguridad no encontrado')
      if (resetCode.isUsed) throw new ValidationError('Código de seguridad ya utilizado')
      if (resetCode.expiredAt < new Date())
        throw new UnauthorizedError('Código de seguridad expirado')

      return resetCode
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError(
        'Error al validar el código de seguridad para el reset de la contraseña',
      )
    }
  }

  static async resetPasswordConfirm({ code, newPassword }: { code: string; newPassword: string }) {
    try {
      const resetCode = await prisma.resetPassword.update({
        where: { code },
        data: { isUsed: true },
      })

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
      return await prisma.user.update({
        where: { pk: resetCode.userId },
        data: { password: hashedPassword },
        omit: { password: true },
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al resetear la contraseña')
    }
  }
}
