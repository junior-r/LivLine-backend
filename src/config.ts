import dotenv from 'dotenv'

dotenv.config()

interface Config {
  PORT: string | number
  ITEMS_PER_PAGE: number
  SALT_ROUNDS: number
  PASSWORDS_CHARSET: string
  SECRET_JWT_KEY: string
  SECRET_REFRESH_KEY: string
  TURNSTILE_SECRET_KEY: string
  EMAIL_FROM: string
  EMAIL_USER: string
  EMAIL_PASSWORD: string
  FRONTEND_URL: string
  EMAIL_HOST: string
  EMAIL_PORT: string
  EMAIL_SECURE: string
  COOKIE_OPTIONS: {
    httpOnly: boolean
    sameSite: boolean | 'lax' | 'none' | 'strict' | undefined
    secure: boolean
  }
}

export const config: Config = {
  PORT: process.env.PORT || 3000,
  SALT_ROUNDS: 10,
  PASSWORDS_CHARSET: process.env.PASSWORDS_CHARSET as string,
  ITEMS_PER_PAGE: Number(process.env.ITEMS_PER_PAGE) || 10,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY as string,
  SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY as string,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  EMAIL_FROM: process.env.EMAIL_FROM as string,
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: process.env.EMAIL_PORT as string,
  EMAIL_SECURE: process.env.EMAIL_SECURE as string,
  COOKIE_OPTIONS: {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  },
}
