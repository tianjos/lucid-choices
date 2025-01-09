export const pick = <const T extends any[]>(items: T, elements: T) =>
  items.filter((item) => elements.includes(item))

export const omit = <const T extends any[]>(items: T, elements: T) =>
  items.filter((item) => !elements.includes(item))
