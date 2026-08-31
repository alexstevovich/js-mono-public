import assert from 'node:assert/strict'
import { PassThrough } from 'node:stream'
import test from 'node:test'

import promptTerminal from '../src/index.js'

test('asks a question and trims the response', async () => {
  const input = new PassThrough()
  const output = new PassThrough()
  let displayed = ''
  output.on('data', (chunk) => {
    displayed += chunk
  })

  input.end('  Alex  \n')
  const answer = await promptTerminal('Name?', { input, output })

  assert.equal(answer, 'Alex')
  assert.equal(displayed, 'Name? ')
})
