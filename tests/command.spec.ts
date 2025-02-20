import { AceFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import MakeEnumCommand from '../commands/make_enum.js'

test.group('Make enum', (group) => {
  group.each.teardown(async ({ context }) => {
    delete process.env.ADONIS_ACE_CWD
    await context.fs.remove('app/enums')
  })
  test('create enum', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl)
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeEnumCommand, ['foo'])
    await command.exec()

    const contents = await fs.contents('foo.txt')

    command.assertLog('green(DONE:)    create app/enums/foo.ts')

    await assert.fileEquals('app/enums/foo.ts', contents)
  })
})
