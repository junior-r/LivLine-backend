import { z } from 'zod'

export const AppointmentSchema = z.object({
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  doctorName: z.string().optional(),
  appointmentDate: z.coerce.date(),
  notes: z.string().optional(),
})

export type AppointmentType = z.infer<typeof AppointmentSchema>

export const validateAppointmentCreation = (data: AppointmentType) => {
  return AppointmentSchema.safeParse(data)
}
