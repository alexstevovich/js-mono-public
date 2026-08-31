import assert from 'node:assert/strict'
import test from 'node:test'

import sshUpdateNpm from '../src/index.js'

test('rejects an empty remote directory before connecting', async () => {
  await assert.rejects(
    sshUpdateNpm({}, ''),
    /remoteDirectory must be a non-empty string/,
  )
})
