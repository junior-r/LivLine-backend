import { z } from 'zod'

export const MedicationSchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  dosage: z.string().min(1, { message: 'Este dato es requerido' }),
  frequency: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export type MedicationType = z.infer<typeof MedicationSchema>

export const validateMedicationCreation = (data: MedicationType) => {
  return MedicationSchema.safeParse(data)
}
