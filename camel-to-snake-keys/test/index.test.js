import assert from 'node:assert/strict'
import test from 'node:test'

import camelToSnakeKeys from '../src/index.js'

test('recursively converts camel-case object keys to snake case', () => {
  assert.deepEqual(
    camelToSnakeKeys({
      userID: 1,
      profileData: { displayName: 'Alex' },
      APIValues: [{ URLValue: true }],
    }),
    {
      user_id: 1,
      profile_data: { display_name: 'Alex' },
      api_values: [{ url_value: true }],
    },
  )
})

test('returns primitive values unchanged', () => {
  assert.equal(camelToSnakeKeys('alreadyCamel'), 'alreadyCamel')
  assert.equal(camelToSnakeKeys(null), null)
})
