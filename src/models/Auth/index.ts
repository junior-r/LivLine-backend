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
} from '@/utils/errors'

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
}
