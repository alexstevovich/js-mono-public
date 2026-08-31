# @alexstevovich/prompt-terminal

Ask one asynchronous question in a terminal.

```js
import promptTerminal from '@alexstevovich/prompt-terminal'

const name = await promptTerminal('Name?')
```

Responses are trimmed by default. Custom input and output streams may be
provided for composition and testing. The readline interface is always closed.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
