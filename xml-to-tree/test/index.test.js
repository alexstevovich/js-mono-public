import assert from 'node:assert/strict'
import test from 'node:test'

import xmlToTree from '../src/index.js'

test('parses elements, attributes, text, and CDATA', () => {
  const tree = xmlToTree(
    '<book id="one">Hello <script><![CDATA[a < b]]></script></book>',
  )
  assert.equal(tree.tag, 'book')
  assert.equal(tree.id, 'one')
  assert.equal(tree.children[0].text, 'Hello ')
  assert.equal(tree.children[1].children[0].tag, '#cdata')
})

test('supports fragments and custom keys', () => {
  const trees = xmlToTree('<a>1</a><b>2</b>', {
    childrenKey: 'nodes',
    tagKey: 'type',
    textKey: 'value',
  })
  assert.equal(trees.length, 2)
  assert.equal(trees[1].type, 'b')
  assert.equal(trees[1].nodes[0].value, '2')
})
