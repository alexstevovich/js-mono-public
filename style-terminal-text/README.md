# @alexstevovich/style-terminal-text

Apply ANSI true-color and text attributes to terminal output.

```js
import styleTerminalText from '@alexstevovich/style-terminal-text'

console.log(
  styleTerminalText('Ready', {
    color: '#22cc88',
    bold: true,
  }),
)
```

Options include `color`, `backgroundColor`, `bold`, `dim`, `italic`,
`underline`, `blink`, `inverse`, and `strikethrough`. Colors use
six-digit hexadecimal notation. Text is returned unchanged when no style is
selected.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
