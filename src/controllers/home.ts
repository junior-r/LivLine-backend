import { Request, Response } from 'express'
import ejs from 'ejs'
import { config } from '@/config'
import { resolveTemplatePath } from '@/utils/resolveTemplatePath'
import { transporter } from '@/utils/nodemailer'
import { AppError } from '@/utils/errors'
import { validateContactMessage } from '@/schemas/contacts'
import { verifyCloudflareChallenge } from '@/utils/verifyCloudflareChallenge'

const { EMAIL_FROM } = config

export class HomeController {
  sendMessage = async (req: Request, res: Response) => {
    const { captchaToken } = req.body

    if (!captchaToken) {
      res.status(400).json({ success: false, message: 'Captcha es requerido' })
      return
    }

    try {
      const challenge = await verifyCloudflareChallenge(captchaToken)

      if (!challenge.success) {
        res.status(400).json({ success: false, message: 'Captcha inválido' })
        return
      }

      const result = validateContactMessage(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const templatePath = resolveTemplatePath('templates/email-contact.ejs')

      const html = await ejs.renderFile(templatePath, {
        userFullname: result.data.fullname,
        userEmail: result.data.email,
        userMessage: result.data.message,
        currentYear: new Date().getFullYear(),
      })

      await transporter.sendMail({
        html,
        to: EMAIL_FROM,
        replyTo: result.data.email,
        from: `Livline <${EMAIL_FROM}>`,
        subject: `Nuevo mensaje de contacto: ${result.data.subject}`,
      })

      res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' })
    } catch (error) {
      console.log(error)
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
