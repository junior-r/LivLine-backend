import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'https://liv-line-frontend.vercel.app',
  'https://www.liv-line-frontend.vercel.app',
  'https://livline.org',
  'https://www.livline.org',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (acceptedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  })
