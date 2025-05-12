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

function zEnumFromObject<T extends Record<string, string>>(obj: T) {
  return z.enum(Object.keys(obj) as [keyof T & string, ...(keyof T & string)[]])
}

export const UserCreateMedicalDataSchema = z.object({
  dateOfBirth: z.coerce.date(),
  sex: zEnumFromObject(UserSexOptions),
  bloodType: zEnumFromObject(UserBloodType),
  country: z.string().min(3, { message: 'Este dato es requerido' }),
  city: z.string().min(3, { message: 'Este dato es requerido' }),
  phone: z.string().min(3, { message: 'Este dato es requerido' }),
  address: z.string().min(3, { message: 'Este dato es requerido' }),
  emergencyContactName: z.string().min(3, { message: 'Este dato es requerido' }),
  emergencyContactPhone: z.string().min(3, { message: 'Este dato es requerido' }),
})

export type UserMedicalDataType = z.infer<typeof UserCreateMedicalDataSchema>

export const validateMedicalDataCreation = (data: UserMedicalDataType) => {
  return UserCreateMedicalDataSchema.safeParse(data)
}
