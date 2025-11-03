import { z } from 'zod'

export const ContactSchema = z.object({
  fullname: z.string().min(2, { message: 'Nombre completo es requerido' }).max(180),
  message: z.string().max(800).min(10, { message: 'Mensaje es requerido' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  subject: z.string().max(180).min(2, { message: 'Asunto es requerido' }),
})

export type Contact = z.infer<typeof ContactSchema>

export const validateContactMessage = (data: Contact) => {
  return ContactSchema.safeParse(data)
}
