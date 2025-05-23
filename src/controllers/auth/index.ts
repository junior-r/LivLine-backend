import { AuthModel } from '@/models/Auth'
import { validateResetPassword, validateUser, validateUserLogin } from '@/schemas/user'
import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { config } from '@/config'
import { logoutUser } from '@/utils/logoutUser'
import { AppError, NotFoundError, ValidationError } from '@/utils/errors'
import { validatePasswords } from '@/utils/validatePasswords'
import ejs from 'ejs'
import path from 'path'
import { transporter } from '@/utils/nodemailer'

const { SECRET_JWT_KEY, SECRET_REFRESH_KEY, COOKIE_OPTIONS, FRONTEND_URL, EMAIL_USER } = config

const resolveTemplatePath = (relativePath: string) => {
  const basePath = process.env.NODE_ENV === 'production' ? 'build' : 'src'
  return path.join(process.cwd(), basePath, relativePath)
}

export class AuthController {
  private model: typeof AuthModel

  constructor({ model }: { model: typeof AuthModel }) {
    this.model = model
  }

  login = async (req: Request, res: Response) => {
    const result = validateUserLogin(req.body)

    if (!result.success || !result.data) {
      res.status(400).json({ error: JSON.parse(result.error.message) })
      return
    }

    const { email, password } = result.data

    try {
      const user = await this.model.loginByEmail({ email, checkPassword: password })
      const token = sign({ pk: user.pk, email: user.email, role: user.role }, SECRET_JWT_KEY, {
        expiresIn: '1d',
      })
      const refreshToken = sign(
        { pk: user.pk, email: user.email, role: user.role },
        SECRET_REFRESH_KEY,
        {
          expiresIn: '7d',
        },
      )

      res
        .cookie('access_token', token, {
          ...COOKIE_OPTIONS,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .cookie('refresh_token', refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .send({ user: user, message: 'Inicio de sesión exitoso' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = validateUser(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const { password, passwordConfirm } = result.data

      validatePasswords(password, passwordConfirm)

      const newUser = await this.model.create({ data: result.data })
      res.status(201).send({ user: newUser, message: 'Cuenta creada correctamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error' })
      return
    }
    return
  }

  resetPasswordSend = async (req: Request, res: Response) => {
    const { email } = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) throw new ValidationError('Correo electrónico es obligatorio')

    if (!emailRegex.test(email)) throw new ValidationError('Correo electrónico no válido')

    try {
      const user = await this.model.loginByEmail({ email })
      if (!user) throw new NotFoundError('Usuario no encontrado')

      const userFullName = `${user.name} ${user.lastName}`
      const resetCode = await this.model.resetPasswordCreate({ userEmail: user.email })
      const resetLink = `${FRONTEND_URL}/auth/reset-password-code/`
      const templatePath = resolveTemplatePath('templates/reset-password.ejs')

      const html = await ejs.renderFile(templatePath, {
        userName: userFullName,
        resetCode: resetCode.code,
        resetLink,
        currentYear: new Date().getFullYear(),
      })

      await transporter.sendMail({
        from: `Livline <${EMAIL_USER}>`,
        to: user.email,
        subject: 'Restablecer contraseña',
        html,
      })

      res.status(200).json({ message: 'Correo electrónico enviado exitosamente' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }

      res.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  resetPasswordValidate = async (req: Request, res: Response) => {
    const { code } = req.body
    if (!code || code.length <= 0) throw new ValidationError('Código de seguridad es obligatorio')

    try {
      const object = await this.model.resetPasswordValidate({ code })
      if (!object) throw new NotFoundError('Código de seguridad no encontrado')

      res.status(200).json({ message: 'Código de seguridad válido', code: object.code })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message, statusText: error.statusText })
        return
      }

      res.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  resetPasswordConfirm = async (req: Request, res: Response) => {
    const { code } = req.params
    if (!code || code.length <= 0)
      throw new ValidationError('El código de seguridad es obligatorio')

    try {
      const result = validateResetPassword(req.body)

      if (!result.success || !result.data) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
        return
      }

      const { newPassword, newPasswordConfirm } = result.data
      validatePasswords(newPassword, newPasswordConfirm)

      await this.model.resetPasswordConfirm({ code, newPassword })
      res.status(200).json({ message: 'Contraseña restablecida exitosamente.' })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message, statusText: error.statusText })
        return
      }

      res.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  logout = async (req: Request, res: Response) => {
    logoutUser(req, res)
  }
}
