import { z } from 'zod'

export const VaccineSchema = z.object({
  name: z.string().min(1, { message: 'Este dato es requerido' }),
  doseNumber: z.coerce.number().min(1, { message: 'Debe ser al menos 1' }),
  vaccinationDate: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export type VaccineType = z.infer<typeof VaccineSchema>

export const validateVaccineCreation = (data: VaccineType) => {
  return VaccineSchema.safeParse(data)
}
