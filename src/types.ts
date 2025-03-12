import { ColumnOptions } from '@adonisjs/lucid/types/model'

export type ChoicesColumnDecorator<T> = {
  enumLike: T
  isLookupReverse?: boolean
}

export type ChoicesOptions<T> = Partial<Pick<ColumnOptions, 'columnName' | 'meta' | 'serialize'>> &
  ChoicesColumnDecorator<T>

export type CherryPick<T> = {
  pick?: T[]
  omit?: T[]
}

export type ValueOf<T> = T[keyof T]

export type KeyOf<T> = Extract<keyof T, string>

export interface EnumLike<T> {
  get selected(): ValueOf<T> | KeyOf<T>

  defaultTo(selected: KeyOf<T> | ValueOf<T>): this

  keys(cherryPick?: Partial<CherryPick<KeyOf<T>>>): KeyOf<T>[]

  values(cherryPick?: Partial<CherryPick<ValueOf<T>>>): ValueOf<T>[]

  update(to: KeyOf<T> | ValueOf<T>): this

  key(): KeyOf<T>

  value(): ValueOf<T>

  isKey(key: any): key is KeyOf<T>

  isValue(value: any): value is ValueOf<T>

  isEquals(other: EnumLike<unknown>): boolean

  in(states: (KeyOf<T> | ValueOf<T>)[]): boolean

  toString(): KeyOf<T> | ValueOf<T>

  toJSON(): { selected: ValueOf<T> | KeyOf<T>; isLookupReverse: boolean }

  valueOf(): number
}
