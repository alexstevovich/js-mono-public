import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import AcidLog from '../src/index.js'

async function fixture(t, options = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'acidlog-'))
  const output = []
  const logger = {
    error: (message) => output.push(message),
    info: (message) => output.push(message),
    log: (message) => output.push(message),
    warn: (message) => output.push(message),
  }
  const acidlog = new AcidLog(path.join(directory, 'logs', 'log.db'), {
    logger,
    ...options,
  })
  t.after(async () => {
    acidlog.close()
    await rm(directory, { force: true, recursive: true })
  })
  return { acidlog, output }
}

test('stores, queries, and forwards log entries', async (t) => {
  const { acidlog, output } = await fixture(t)
  acidlog.info('started', 'worker')
  acidlog.error('failed')

  assert.equal(acidlog.getRecent()[0].message, 'failed')
  assert.equal(acidlog.getByLevel('info')[0].system, 'worker')
  assert.deepEqual(output, ['worker | [INFO] started', '[ERROR] failed'])
})

test('prunes by age and maximum entry count', async (t) => {
  const { acidlog } = await fixture(t, { maxEntries: 2, retentionDays: 1 })
  const now = Math.floor(Date.now() / 1000)

  acidlog.addEntry({ message: 'old', ts: now - 2 * 24 * 60 * 60 })
  acidlog.addEntry({ message: 'first', ts: now })
  acidlog.addEntry({ message: 'second', ts: now })
  acidlog.addEntry({ message: 'third', ts: now })

  assert.deepEqual(
    acidlog.getAll().map(({ message }) => message),
    ['third', 'second'],
  )
})

test('creates a system-scoped console-compatible logger', async (t) => {
  const { acidlog } = await fixture(t)
  const logger = acidlog.createLogger('api')
  logger.log('request')
  assert.equal(acidlog.getRecent(1)[0].system, 'api')
})
