import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { choices } from '../src/decorator.js'
import { EnumLike } from '../src/types.js'
import { createDb, createTables } from '../test-helpers/setup_db.js'
import { Profile } from '../test-helpers/setup_enum.js'
import { $choices } from '../src/service.js'

test.group('choices decorator', () => {
  test('choices column with default to admin value', async ({ assert }) => {
    const db = await createDb()
    await createTables(db)

    class User extends BaseModel {
      @column()
      declare username: string

      @choices({ enumLike: Profile })
      declare profile: EnumLike<typeof Profile>
    }

    const user = new User()

    user.fill({
      username: 'foo',
      profile: $choices(Profile).defaultTo('ADMIN'),
    })

    await user.save()

    assert.isTrue(user.profile.isEquals('ADMIN'))
  })

  test('choices column with lookup reverse', async ({ assert }) => {
    const db = await createDb()
    await createTables(db, true)

    class User extends BaseModel {
      @column()
      declare username: string

      @choices({ enumLike: Profile, isLookupReverse: true })
      declare profile: EnumLike<typeof Profile>
    }

    const user = new User()

    user.fill({
      username: 'foo',
      profile: $choices(Profile).defaultTo('ADMIN'),
    })

    await user.save()

    const userFromDb = await User.firstOrFail()

    assert.isTrue(userFromDb.profile.isEquals('admin'))
  })

  test('choices column type of enum like', ({ expectTypeOf }) => {
    class User extends BaseModel {
      @column()
      declare username: string

      @choices({ enumLike: Profile })
      declare profile: EnumLike<typeof Profile>
    }

    const user = new User()

    expectTypeOf(user.profile).toEqualTypeOf<EnumLike<typeof Profile>>()
  })

  test('choices column serialize', ({ assert }) => {
    class User extends BaseModel {
      @column()
      declare username: string

      @choices({ enumLike: Profile })
      declare profile: EnumLike<typeof Profile>
    }

    const user = new User()

    user.fill({
      username: 'foo',
      profile: $choices(Profile).defaultTo('ADMIN'),
    })

    assert.deepEqual({ username: 'foo', profile: 'ADMIN' }, user.serialize())
  })
})
