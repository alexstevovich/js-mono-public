# @alexstevovich/fastify-refresh

Add manually triggered live browser refresh to a Fastify development server.

```js
import websocket from '@fastify/websocket'
import fastifyRefresh from '@alexstevovich/fastify-refresh'

await app.register(websocket)
await app.register(fastifyRefresh)

watcher.on('change', () => app.refreshClients())
```

The plugin injects a small WebSocket client into HTML responses. Register
`@fastify/websocket` first. Options can override `socketRoute`, `scriptRoute`,
and an optional POST `triggerRoute`. `refreshClients()` returns the number of
open clients notified.

This development utility uses ECMAScript modules and is private until
explicitly reviewed for publication.

## License

Apache-2.0. Copyright 2022 Alex Stevovich.
