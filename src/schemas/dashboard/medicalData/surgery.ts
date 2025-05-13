import { z } from 'zod'

export const SurgerySchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export type SurgeryType = z.infer<typeof SurgerySchema>

export const validateSurgeryCreation = (data: SurgeryType) => {
  return SurgerySchema.safeParse(data)
}
