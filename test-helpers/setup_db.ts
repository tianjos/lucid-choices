import { Emitter } from '@adonisjs/core/events'
import { AppFactory } from '@adonisjs/core/factories/app'
import { LoggerFactory } from '@adonisjs/core/factories/logger'
import { Database } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'
import { getActiveTest } from '@japa/runner'
// import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { $choices } from '../src/service.js'
import { Profile } from './setup_enum.js'

export const createDb = async () => {
  const test = getActiveTest()

  if (!test) {
    throw new Error('Cannot use "createDb" outside of japa test environment')
  }

  //   await mkdir(test.context.fs.basePath)

  const app = new AppFactory().create(test.context.fs.baseUrl, () => {})
  const logger = new LoggerFactory().create()
  const emitter = new Emitter(app)
  const db = new Database(
    {
      connection: process.env.DB || 'sqlite',
      connections: {
        sqlite: {
          client: 'sqlite3',
          connection: {
            filename: join(test.context.fs.basePath, 'db.sqlite3'),
          },
        },
      },
    },
    logger,
    emitter
  )

  test.cleanup(() => db.manager.closeAll())
  BaseModel.useAdapter(db.modelAdapter())

  return db
}

export const createTables = async (db: Database, isLookupReverse = false) => {
  const test = getActiveTest()

  if (!test) {
    throw new Error('Cannot use "createTables" outside of a japa test environment')
  }

  test.cleanup(async () => {
    await db.connection().schema.dropTableIfExists('users')
  })

  await db.connection().schema.createTable('users', (table) => {
    table.increments()
    table.string('username').unique()
    table.enum('profile', isLookupReverse ? $choices(Profile).values() : $choices(Profile).keys())
  })
}
