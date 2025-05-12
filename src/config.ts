import dotenv from 'dotenv'

dotenv.config()

interface Config {
  PORT: string | number
  ITEMS_PER_PAGE: number
  SALT_ROUNDS: number
  PASSWORDS_CHARSET: string
  SECRET_JWT_KEY: string
  SECRET_REFRESH_KEY: string
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
  COOKIE_OPTIONS: {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  },
}
