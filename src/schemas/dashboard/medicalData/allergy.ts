import { zEnumFromObject } from '@/utils/zEnumFromObject'
import { z } from 'zod'

export const AllergySeverityOptions = {
  Mild: 'Leve',
  Moderate: 'Moderada',
  Severe: 'Severa',
} as const

export const AllergySchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  reaction: z.string().min(1, { message: 'Este dato es requerido' }),
  severity: zEnumFromObject(AllergySeverityOptions),
  notes: z.string().optional(),
})

export type AllergyType = z.infer<typeof AllergySchema>

export const validateAllergyCreation = (data: AllergyType) => {
  return AllergySchema.safeParse(data)
}
