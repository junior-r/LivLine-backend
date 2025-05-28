import { AllergySeverity } from '@prisma/client'
import { z } from 'zod'

export const AllergySchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  reaction: z.string().min(1, { message: 'Este dato es requerido' }),
  severity: z.nativeEnum(AllergySeverity),
  notes: z.string().optional(),
})

export type AllergyType = z.infer<typeof AllergySchema>

export const validateAllergyCreation = (data: AllergyType) => {
  return AllergySchema.safeParse(data)
}
