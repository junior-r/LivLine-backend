import { User } from '@prisma/client'

export const returnUserInfo = (user: User) => {
  return {
    pk: user.pk,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
  }
}
