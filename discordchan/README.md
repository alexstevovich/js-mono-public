# @alexstevovich/discordchan

Send text or JSON-formatted messages to a Discord webhook.

```js
import DiscordChan from '@alexstevovich/discordchan'

const channel = new DiscordChan(webhook)
await channel.send({ status: 'ready' })
```

Pass `{ dryRun: true }` to simulate delivery locally. DiscordChan uses the
global Fetch API and has no runtime package dependencies.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2020 Alex Stevovich.
