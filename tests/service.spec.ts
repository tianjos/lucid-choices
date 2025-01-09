import { test } from '@japa/runner'
import { $choices } from '../src/service.js'

test.group('Choice Service', () => {
  const enumLike = {
    FOO: 'foo',
    BAR: 'bar',
  } as const

  test('key', ({ assert }) => {
    const key = $choices(enumLike).defaultTo('BAR').key()

    assert.equal(key, 'BAR')
  })

  test('value', ({ assert }) => {
    const value = $choices(enumLike).defaultTo('BAR').value()

    assert.equal(value, 'bar')
  })

  test('keys', ({ assert }) => {
    const keys = $choices(enumLike).keys()

    assert.deepEqual(keys, ['FOO', 'BAR'])
  })

  test('values', ({ assert }) => {
    const values = $choices(enumLike).values()

    assert.deepEqual(values, ['foo', 'bar'])
  })

  test('default to', ({ assert }) => {
    assert.equal($choices(enumLike).defaultTo('BAR').toString(), 'BAR')
  })

  test('in', ({ assert }) => {
    assert.isTrue($choices(enumLike).defaultTo('BAR').in(['BAR', 'FOO']))
  })

  test('is equals', ({ assert }) => {
    assert.isTrue($choices(enumLike).defaultTo('FOO').isEquals('FOO'))
  })

  test('pick keys', ({ assert }) => {
    const pick = $choices(enumLike).keys({ pick: ['FOO'] })

    assert.deepEqual(pick, ['FOO'])
  })

  test('pick values', ({ assert }) => {
    const pick = $choices(enumLike).values({ pick: ['bar'] })

    assert.deepEqual(pick, ['bar'])
  })

  test('omit keys', ({ assert }) => {
    const omit = $choices(enumLike).keys({ omit: ['BAR'] })

    assert.deepEqual(omit, ['FOO'])
  })

  test('omit values', ({ assert }) => {
    const omit = $choices(enumLike).values({ omit: ['bar'] })

    assert.deepEqual(omit, ['foo'])
  })

  test('update', ({ assert }) => {
    const key = $choices(enumLike).defaultTo('FOO').update('BAR').key()

    assert.equal(key, 'BAR')
  })
})
