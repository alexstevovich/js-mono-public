import assert from 'node:assert/strict'
import test from 'node:test'

import styleTerminalText from '../src/index.js'

test('combines text attributes and true colors', () => {
  assert.equal(
    styleTerminalText('hello', {
      color: '#ff8000',
      backgroundColor: '001122',
      bold: true,
      underline: true,
    }),
    '\u001b[1;4;38;2;255;128;0;48;2;0;17;34mhello\u001b[0m',
  )
})

test('leaves unstyled text unchanged and validates colors', () => {
  assert.equal(styleTerminalText('plain'), 'plain')
  assert.throws(() => styleTerminalText('text', { color: '#fff' }), TypeError)
})
