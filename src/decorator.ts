import { LucidModel } from '@adonisjs/lucid/types/model'
import { ChoiceService } from './service.js'
import { ChoicesOptions, EnumLike, KeyOf, ValueOf } from './types.js'

const prepareColumn = <T>(enumLike: EnumLike<T>, isLookupReverse: boolean = false) =>
  isLookupReverse ? enumLike.value() : enumLike.key()

const consumeColumn = <T, K extends KeyOf<T>, V extends ValueOf<T>>(
  enumLike: T,
  valueOrKey: K | V
) => ChoiceService.use(enumLike).defaultTo(valueOrKey)

export const choices = <T>(enumOpts: ChoicesOptions<T>) => {
  return function decorateAsColumn(target: any, property: string) {
    const Model = target.constructor as LucidModel
    Model.boot()

    const { enumLike, isLookupReverse } = enumOpts

    const options = Model.$columnsDefinitions.get(property)

    Model.$addColumn(property, {
      ...options,
      ...{
        prepare: (enumColumn: ChoiceService<typeof enumLike> | null) =>
          enumColumn ? prepareColumn(enumColumn, isLookupReverse) : null,
        consume: (value: any | null) => (value ? consumeColumn(enumLike, value) : null),
        serialize: (enumColumn: ChoiceService<T> | null) =>
          enumColumn ? (isLookupReverse ? enumColumn.value() : enumColumn.key()) : null,
      },
    })
  }
}
