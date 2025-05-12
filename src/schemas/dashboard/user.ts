import { z } from 'zod'

export const UserRoleType = {
  admin: 'Admin',
  doctor: 'Doctor',
  patient: 'Paciente',
} as const

function zEnumFromObject<T extends Record<string, string>>(obj: T) {
  return z.enum(Object.keys(obj) as [keyof T & string, ...(keyof T & string)[]])
}

export const UserCreateSchema = z.object({
  name: z.string().min(3, { message: 'Este dato es requerido' }),
  lastName: z.string().min(3, { message: 'Este dato es requerido' }),
  email: z.string().email(),
  role: zEnumFromObject(UserRoleType),
})

export type UserCreateType = z.infer<typeof UserCreateSchema>

export const validateUserCreation = (data: UserCreateType) => {
  return UserCreateSchema.safeParse(data)
}
