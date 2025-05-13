import { z } from 'zod'

export const ChronicConditionSchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  diagnosisDate: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export type ChronicConditionType = z.infer<typeof ChronicConditionSchema>

export const validateChronicConditionCreation = (data: ChronicConditionType) => {
  return ChronicConditionSchema.safeParse(data)
}
