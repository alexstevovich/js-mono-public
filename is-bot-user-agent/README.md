# @alexstevovich/is-bot-user-agent

Detect likely automated clients from an HTTP user agent using transparent,
deterministic heuristics.

```js
import isBotUserAgent from '@alexstevovich/is-bot-user-agent'

isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)') // true
isBotUserAgent('Mozilla/5.0 Chrome/140.0 Safari/537.36') // false
```

The result is heuristic, not proof of a client's identity. User-agent strings
can be absent, misleading, or forged. Pass the user-agent string itself rather
than a request object so the package's input and purpose remain explicit.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
