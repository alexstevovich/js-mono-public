import assert from 'node:assert/strict'
import test from 'node:test'

import DiscordChan from '../src/index.js'

test('supports dry-run delivery without a webhook', async () => {
  const originalLog = console.log
  const messages = []
  console.log = (...values) => messages.push(values)
  try {
    const channel = new DiscordChan(null, { dryRun: true })
    assert.deepEqual(await channel.send({ ready: true }), { simulated: true })
    assert.equal(messages.length, 1)
  } finally {
    console.log = originalLog
  }
})

test('checks whether a webhook is present', () => {
  assert.equal(new DiscordChan(null).verify(), false)
  assert.equal(new DiscordChan('https://discord.com/example').verify(), true)
})
