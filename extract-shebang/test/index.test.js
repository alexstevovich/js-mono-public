import assert from 'node:assert/strict'
import test from 'node:test'
import extractShebang from '../src/index.js'

test('separates a complete leading shebang line', () => {
  assert.deepEqual(extractShebang('#!/usr/bin/env node\nrun()'), {
    shebang: '#!/usr/bin/env node\n',
    content: 'run()',
  })
})

test('leaves content without a complete shebang line unchanged', () => {
  assert.deepEqual(extractShebang('#!/usr/bin/env node'), {
    shebang: '',
    content: '#!/usr/bin/env node',
  })
})
