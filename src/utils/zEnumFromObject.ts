import { z } from 'zod'

export const zEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  return z.enum(Object.keys(obj) as [keyof T & string, ...(keyof T & string)[]])
}
