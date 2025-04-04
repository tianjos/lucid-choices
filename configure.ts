/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { readFile, writeFile } from 'node:fs/promises'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile(async (rcFile) => {
    rcFile.addProvider('@tianjos/lucid-choices/lucid_choices_provider')
    rcFile.setDirectory('enums', 'app/enums')
    rcFile.addCommand('@tianjos/lucid-choices/commands')

    const packageJsonPath = command.app.makePath('package.json')
    const packageJson = await readFile(packageJsonPath, 'utf-8').then(JSON.parse)

    packageJson.imports = {
      ...packageJson.imports,
      '#enums/*': './app/enums/*.js',
    }

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), {
      encoding: 'utf-8',
    })
  })

  await codemods.makeUsingStub(stubsRoot, 'middleware.stub', {
    entity: command.app.generators.createEntity('lucid_choices'),
  })

  await codemods.registerMiddleware('named', [
    {
      name: 'enum',
      path: '#middleware/lucid_choices_middleware',
    },
  ])
}
