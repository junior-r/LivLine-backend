import { AuthModel } from '@/models/Auth'
import { validateUser, validateUserLogin } from '@/schemas/user'
import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { config } from '@/config'
import { logoutUser } from '@/utils/logoutUser'
import { AppError } from '@/utils/errors'
import { validatePasswords } from '@/utils/validatePasswords'

const { SECRET_JWT_KEY, SECRET_REFRESH_KEY, COOKIE_OPTIONS } = config

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
        .send({ user: user, message: 'Logged in successfully' })
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

  logout = async (req: Request, res: Response) => {
    logoutUser(req, res)
  }
}
