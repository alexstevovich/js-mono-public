import assert from 'node:assert/strict'
import test from 'node:test'

import { fragment, leaf, tag, text } from '../src/index.js'

test('renders nested elements and attributes', () => {
  const element = tag('div')
  element.id = 'example'
  element.addClass('card')
  element.add(text('content'))

  assert.equal(element.toHtml(), '<div class="card" id="example">content</div>')
})

test('renders fragments and leaf elements', () => {
  const output = fragment()
  const meta = leaf('meta')
  meta.setAttribute('charset', 'utf-8')
  output.add(meta)

  assert.equal(output.toHtml(), '<meta charset="utf-8">')
})
