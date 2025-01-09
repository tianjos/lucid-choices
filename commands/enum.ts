import { args, BaseCommand } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MakeEnumCommand extends BaseCommand {
  static commandName = 'make:enum'
  static description = 'Create a new enum like object'
  static help = [
    'The make:enum command create a file with enum like object',
    'You must pass the name of enum as first argument',
    'Example: {{ binaryName }} make:enum user_profile',
  ]

  @args.string({ description: 'The name of enum object' })
  declare name: string

  protected stubPath = 'make/enum.stub'

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const fileName = this.app.generators.modelFileName(entity.name)
    const className = this.app.generators.modelName(entity.name)
    const exportPath = this.app.makePath('app/enums', entity.path, fileName)

    const codemodes = await this.createCodemods()
    await codemodes.makeUsingStub(stubsRoot, this.stubPath, {
      entity,
      fileName,
      className,
      exportPath,
    })
  }
}
