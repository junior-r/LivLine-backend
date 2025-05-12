export function getEnumKeyByLabel<T extends Record<string, string>>(
  enumObj: T,
  label: string,
): keyof T {
  const entry = Object.entries(enumObj).find(([_, l]) => l === label)
  if (!entry) throw new Error(`Valor inválido: ${label}`)
  return entry[0] as keyof T
}
