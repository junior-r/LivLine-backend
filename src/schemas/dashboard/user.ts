import { zEnumFromObject } from '@/utils/zEnumFromObject'
import { z } from 'zod'

export const UserRoleType = {
  admin: 'Admin',
  doctor: 'Doctor',
  patient: 'Paciente',
} as const

export const UserIdType = {
  IdenityCard: 'Tarjeta de identidad',
  DNI: 'Cédula de ciudadanía',
} as const

export const UserCreateSchema = z.object({
  name: z.string().min(3, { message: 'Este dato es requerido' }),
  lastName: z.string().min(3, { message: 'Este dato es requerido' }),
  email: z.string().email(),
  role: zEnumFromObject(UserRoleType),
  idDocType: zEnumFromObject(UserIdType),
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
