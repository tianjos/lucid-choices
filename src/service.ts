import { CherryPick, EnumLike, KeyOf, ValueOf } from './types.js'
import { omit, pick } from './utils.js'

export class ChoiceService<T> implements EnumLike<T> {
  #selected!: KeyOf<T> | ValueOf<T>

  #makeLookupReverse() {
    const found = Object.entries(this.$enum as any).find(([_, value]) => value === this.#selected)
    if (!found) {
      return
    }

    const [key] = found

    return key as keyof T
  }

  #makeLookup() {
    return (this.$enum as any)[this.#selected] as ValueOf<T>
  }

  static use<T>(enumLike: T) {
    return new ChoiceService(enumLike)
  }

  constructor(public readonly $enum: T) {}

  defaultTo(selected: KeyOf<T> | ValueOf<T>) {
    this.#selected = selected

    return this
  }

  keys(cherryPick?: Partial<CherryPick<KeyOf<T>>>) {
    if (cherryPick?.omit || cherryPick?.pick) {
      const s = new Set([
        ...(cherryPick.omit ? omit(Object.keys(this.$enum as any), cherryPick.omit) : []),
        ...(cherryPick.pick ? pick(Object.keys(this.$enum as any), cherryPick.pick) : []),
      ])

      return Array.from(s) as KeyOf<T>[]
    }

    return Object.keys(this.$enum as any) as KeyOf<T>[]
  }

  key() {
    return this.isKey(this.#selected) ? this.#selected : (this.#makeLookupReverse() as KeyOf<T>)
  }

  values(cherryPick?: Partial<CherryPick<ValueOf<T>>>) {
    if (cherryPick?.omit || cherryPick?.pick) {
      const s = new Set([
        ...(cherryPick.omit ? omit(Object.values(this.$enum as any), cherryPick.omit) : []),
        ...(cherryPick.pick ? pick(Object.values(this.$enum as any), cherryPick.pick) : []),
      ])

      return Array.from(s) as ValueOf<T>[]
    }

    return Object.values(this.$enum as any) as ValueOf<T>[]
  }

  value() {
    return this.isValue(this.#selected) ? this.#selected : (this.#makeLookup() as ValueOf<T>)
  }

  isKey(key: any): key is KeyOf<T> {
    return this.keys().includes(key)
  }

  isValue(value: any): value is ValueOf<T> {
    return this.values().includes(value)
  }

  isEquals(to: KeyOf<T> | ValueOf<T>): boolean {
    return this.#selected === to
  }

  in(states: (KeyOf<T> | ValueOf<T>)[]) {
    return states.includes(this.#selected)
  }

  update(to: KeyOf<T> | ValueOf<T>) {
    return ChoiceService.use(this.$enum).defaultTo(to) as this
  }

  toString() {
    return this.#selected
  }
}

export const $choices = <T>(enumLike: T) => ChoiceService.use(enumLike)
