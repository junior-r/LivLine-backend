import { z } from 'zod'

export const UserSexOptions = {
  M: 'Masculino',
  F: 'Femenino',
  O: 'Otro',
} as const

export const UserBloodTypeOptions = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
  O_POS: 'O+',
  O_NEG: 'O-',
} as const

const createEnumSchema = <T extends Record<string, string>>(obj: T) => {
  const keys = Object.keys(obj)
  return z.enum(keys as [string, ...string[]])
}

export const SexSchema = createEnumSchema(UserSexOptions)
export const BloodTypeSchema = createEnumSchema(UserBloodTypeOptions)

export const MedicalDataSchema = z.object({
  dateOfBirth: z.coerce.date().min(new Date('1900-01-01'), { message: 'Fecha demasiado antigua' }),
  sex: SexSchema,
  bloodType: BloodTypeSchema,
  country: z.string().min(3, 'Este dato es requerido'),
  city: z.string().min(3, 'Este dato es requerido'),
  phone: z.string().min(3, 'Este dato es requerido'),
  address: z.string().min(3, 'Este dato es requerido'),
  emergencyContactName: z.string().min(3, 'Este dato es requerido'),
  emergencyContactPhone: z.string().min(3, 'Este dato es requerido'),
})

export const MedicalDataUpdateSchema = MedicalDataSchema.partial()

export type MedicalDataType = z.infer<typeof MedicalDataSchema>
export type MedicalDataUpdateType = z.infer<typeof MedicalDataUpdateSchema>

export const validateMedicalDataCreation = (data: MedicalDataType) => {
  return MedicalDataSchema.safeParse(data)
}

export const validateMedicalDataEdition = (data: MedicalDataUpdateType) => {
  return MedicalDataUpdateSchema.safeParse(data)
}
