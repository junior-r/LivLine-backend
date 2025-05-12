import { z } from 'zod'

export const UserSexOptions = {
  M: 'Masculino',
  F: 'Femenino',
  O: 'Otro',
} as const

export const UserBloodType = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
  O_POS: 'O+',
  O_NEG: 'O-',
} as const

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
  dateOfBirth: z.coerce.date(),
  sex: zEnumFromObject(UserSexOptions),
  bloodType: zEnumFromObject(UserBloodType),
  country: z.string().min(3, { message: 'Este dato es requerido' }),
  city: z.string().min(3, { message: 'Este dato es requerido' }),
  phone: z.string().min(3, { message: 'Este dato es requerido' }),
  role: zEnumFromObject(UserRoleType),
})

export type UserCreateType = z.infer<typeof UserCreateSchema>

export const validateUserCreation = (data: UserCreateType) => {
  return UserCreateSchema.safeParse(data)
}
