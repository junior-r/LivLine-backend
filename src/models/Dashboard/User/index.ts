import { Prisma, PrismaClient } from '@prisma/client'
import { config } from '@/config'
import { AppError, ConflictError, ServerError } from '@/utils/errors'
import { UserCreateType } from '@/schemas/dashboard/user'
import bcrypt from 'bcryptjs'
import { generateSecurePassword } from '@/utils/generateSecurePassword'
import { returnUserInfo } from '@/utils/returnUserInfo'

const prisma = new PrismaClient()
const { SALT_ROUNDS, PASSWORDS_CHARSET } = config

export class DashboardUserModel {
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
      return returnUserInfo(newObject)
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
}
