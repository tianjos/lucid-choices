# @tianjos/lucid-choices

This is an opinionated package with convention over configuration principle
as a design decision.

## Motivation

- Do you feel that typescript enum is not enough for you?
- Do you have to always passing by your enums everywhere in your code base?
- Do you take time to handle enums as selectable fields in your views?

If you answer yes for any of these question, give this package a try

- Turn any lucid model into a choices field
- Bring choices inwards your models
- Keep all related choices inside your model

## Installation

You can easily install and configure via the Ace CLI's `add` command.

```shell
node ace add @tianjos/lucid-choices
```

This command will setup the right things for you.

## Usage

First of all, we need to define an enum like object.
We can achieve this, by using:

```shell
node ace make:enum profile
```

This ace command will create a file in app/enums with profile.ts file name.

```
export const Profile = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  REVIEWER: 'reviewer',
  PUBLISHER: 'publisher',
} as const // <- this is important!!!

```

##### Using enum like as lucid column with choices

```
import { choices, EnumLike } from '@tianjos/choices'
import { Profile } from '#enums/profile'

  // model.js
  class User extends BaseModel {
    @column()
    declare username: string

    @choices({ enumLike: Profile })
    declare profile: EnumLike<typeof Profile>
  }

  // service.js
  const user = new User()
  const user.fill({
    username: 'foo',
    profile: $choices(Profile).defaultTo('ADMIN')
  })
```

##### Using choices as a service

```
import { $choices } from '@tianjos/choices'

// set default value
$choices(Profile).defaultTo('ADMIN')

// cherry picking
$choices(Profile).keys({ omit: ['ADMIN'] }) // ['MODERATOR', 'REVIEWER', 'PUBLISHER']
$choices(Profile).keys({ pick: ['ADMIN', 'MODERATOR'] }) // ['ADMIN', 'MODERATOR']
```

##### Using choices as an edge global

If you are using edge.js, you can use $choices inside your templates.

```
// component.edge
@!select({
  label: 'profiles',
  options: $choices(Profile).keys(),
  selected: user.profile.key()
})

```
