import nodemailer from 'nodemailer'
import { config } from '@/config'

const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE } = config

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: EMAIL_SECURE === 'true',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})
