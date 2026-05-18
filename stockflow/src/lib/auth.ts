import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'secret-for-mvp-only-change-in-prod'

export function encrypt(payload: object): string {
  return jwt.sign(payload, secretKey, { expiresIn: '1d' })
}

export function decrypt(token: string): any {
  try {
    return jwt.verify(token, secretKey)
  } catch {
    return null
  }
}

export function getSession(): any {
  const session = cookies().get('session')?.value
  if (!session) return null
  return decrypt(session)
}
