import { z } from 'zod'
import { Sex, BloodType } from '@prisma/client'

export const MedicalDataSchema = z.object({
  dateOfBirth: z.coerce.date().min(new Date('1900-01-01'), { message: 'Fecha demasiado antigua' }),
  sex: z.nativeEnum(Sex),
  bloodType: z.nativeEnum(BloodType),
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
