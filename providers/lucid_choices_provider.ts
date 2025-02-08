import { ApplicationService } from '@adonisjs/core/types';
import { choices as decorator } from '../src/decorator.js';
import { $choices as service } from '../src/service.js';


declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'tianjos.choices': {
      $choices: typeof service
      choices: typeof decorator
    }
  }
}

export default class LucidChoicesProvider {
  constructor(protected app: ApplicationService) { }

  protected async registerChoicesInEdge($choices: typeof service) {
    if (!this.app.usingEdgeJS) return

    const edgeExports = await import('edge.js')
    edgeExports.default.global('$choices', $choices)
  }

  register() {
    this.app.container.singleton('tianjos.choices', async () => {
      return { $choices: service, choices: decorator }
    })
  }

  async boot() {
    const { $choices, choices } = await this.app.container.make('tianjos.choices')

    this.registerChoicesInEdge($choices)

    return { $choices, choices }
  }
}
