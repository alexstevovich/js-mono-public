import assert from 'node:assert/strict'
import test from 'node:test'

import { applyShipmast, removeShipmast } from '../src/index.js'

const template = `
 * Copyright 2022-{{$year_full}} Alex Stevovich
 * file_name: {{$file_path_relative}}
 * file_uuid: {{$file_uuid}}
 * generated_on: {{$generated_on_iso}}
 * file_hash: {{$file_hash}}
 * mast_hash: {{$mast_hash}}
 * generated_by: {{$generated_by}}
`

test('applies a mast after the shebang and preserves the complete document', () => {
  const source =
    '#!/usr/bin/env node\n// Existing comment\nconst value = 1\n// footer\n'
  const result = applyShipmast(source, template, {
    filePath: '/project/src/index.js',
    rootDirectory: '/project',
    generatedOn: '2026-01-01T00:00:00.000Z',
    uuid: '123e4567-e89b-42d3-a456-426614174000',
  })

  assert.equal(result.updated, true)
  assert.equal(result.content.startsWith('#!/usr/bin/env node\n/*˹'), true)
  assert.match(result.content, /file_name: src\/index\.js/)
  assert.match(result.content, /const value = 1\n\/\/ footer\n$/)
  assert.equal(removeShipmast(result.content), source)
})

test('returns an existing current mast byte-for-byte unchanged', () => {
  const source = 'export default true\n'
  const first = applyShipmast(source, template, {
    generatedOn: '2026-01-01T00:00:00.000Z',
    uuid: '123e4567-e89b-42d3-a456-426614174000',
  })
  const second = applyShipmast(first.content, template, {
    generatedOn: '2030-01-01T00:00:00.000Z',
  })

  assert.equal(second.updated, false)
  assert.equal(second.content, first.content)
})

test('updates a mast when the source changes', () => {
  const first = applyShipmast('const value = 1\n', template, {
    uuid: '123e4567-e89b-42d3-a456-426614174000',
  })
  const changed = first.content.replace('value = 1', 'value = 2')
  const second = applyShipmast(changed, template)

  assert.equal(second.updated, true)
  assert.match(second.content, /value = 2/)
})
