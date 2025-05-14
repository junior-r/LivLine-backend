import { UserUpdate } from '@/schemas/user'
import { Prisma, PrismaClient } from '@prisma/client'
import { config } from '@/config'
import { getDataForUpdate } from '@/utils/getDataForUpdate'
import { AppError, NotFoundError, ServerError } from '@/utils/errors'

const prisma = new PrismaClient()
const { ITEMS_PER_PAGE } = config

export class UserModel {
  static async getAll(params?: { page?: number; search?: string }) {
    const page = params?.page ?? 1
    const search = params?.search ?? ''
    const take = ITEMS_PER_PAGE
    const skip = (page - 1) * ITEMS_PER_PAGE

    try {
      const whereClause: Prisma.UserWhereInput = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}

      const [totalItems, objects] = await Promise.all([
        prisma.user.count({ where: whereClause }),
        prisma.user.findMany({
          where: whereClause,
          omit: { password: true },
          orderBy: [{ createdAt: 'desc' }],
          take,
          skip,
        }),
      ])

      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

      return { objects, totalItems, totalPages }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Errror al intentar obtener los usuarios')
    }
  }

  static async getByPk({ pk }: { pk: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          pk,
        },
        omit: {
          password: true,
        },
      })
      if (!user) throw new NotFoundError('Usuario no encontrado')
      return user
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar obtener el usuario')
    }
  }

  static async getByEmailOrPk({ query }: { query: string }) {
    try {
      const whereClause: Prisma.UserWhereInput = {
        OR: [{ email: { equals: query, mode: 'insensitive' } }, { pk: { equals: query } }],
      }

      const pk = await prisma.user.findFirst({
        where: whereClause,
        select: { pk: true },
      })
      if (!pk) throw new NotFoundError('Usuario no encontrado')
      return pk
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar obtener el usuario')
    }
  }

  static async update({ pk, data }: { pk: string; data: Partial<UserUpdate> }) {
    const newData = getDataForUpdate(data)

    try {
      const user = await prisma.user.update({
        where: { pk },
        data: newData,
        omit: { password: true },
      })
      return user
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new ServerError('Error al intentar actualizar el usuario')
    }
  }
}
