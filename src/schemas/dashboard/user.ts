import { IdType, Role } from '@prisma/client'
import { z } from 'zod'

export const UserCreateSchema = z.object({
  name: z.string().min(3, { message: 'Este dato es requerido' }),
  lastName: z.string().min(3, { message: 'Este dato es requerido' }),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  idDocType: z.nativeEnum(IdType),
  idNumber: z.string().min(3, { message: 'Este dato es requerido' }),
})

export const UserUpdateSchema = UserCreateSchema.partial()

export type UserCreateType = z.infer<typeof UserCreateSchema>
export type UserUpdateType = z.infer<typeof UserUpdateSchema>

export const validateUserCreation = (data: UserCreateType) => {
  return UserCreateSchema.safeParse(data)
}

export const validateUserUpdate = (data: UserUpdateType) => {
  return UserUpdateSchema.safeParse(data)
}
