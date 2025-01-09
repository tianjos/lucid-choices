import { ApplicationService } from '@adonisjs/core/types'
import { $choices as service } from '../src/service.js'
import { choices as decorator } from '../src/decorator.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'tianjos.choices': {
      $choices: typeof service
      choices: typeof decorator
    }
  }
}

export default class LucidChoicesProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('tianjos.choices', async () => {
      return { $choices: service, choices: decorator }
    })
  }

  async boot() {
    const { $choices, choices } = await this.app.container.make('tianjos.choices')

    return { $choices, choices }
  }
}
