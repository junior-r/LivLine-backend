import crypto from 'node:crypto'

export function generateSecurePassword(charset: string, length = 16): string {
  const bytes = crypto.randomBytes(length)
  const password = Array.from(bytes)
    .map((b) => charset[b % charset.length])
    .join('')
  return password
}
