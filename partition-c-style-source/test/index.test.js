import assert from 'node:assert/strict'
import test from 'node:test'

import partitionCStyleSource from '../src/index.js'

test('partitions source into lossless regions', () => {
  const shebang = '#!/usr/bin/env node\n'
  const header = '\n/** Header */\n// Details\n\n'
  const body = 'function test() {}'
  const footer = '\n\n// Footer\n'
  const source = shebang + header + body + footer

  const result = partitionCStyleSource(source)

  assert.deepEqual(result, { shebang, header, body, footer })
  assert.equal(
    result.shebang + result.header + result.body + result.footer,
    source,
  )
})

test('treats source without code as header', () => {
  assert.deepEqual(partitionCStyleSource(' \n/* comment */\n'), {
    shebang: '',
    header: ' \n/* comment */\n',
    body: '',
    footer: '',
  })
})

test('rejects non-string input', () => {
  assert.throws(() => partitionCStyleSource(null), {
    name: 'TypeError',
    message: 'content must be a string',
  })
})
