import assert from 'node:assert/strict'
import test from 'node:test'

import { Prop, Rule, Sheet, Var } from '../src/index.js'

test('composes CSS properties, variables, and rules', () => {
  assert.equal(new Prop('color', 'navy').toCss(), 'color: navy;')
  assert.equal(new Var('gap', '1rem').var, 'var(--gap)')

  const sheet = new Sheet()
  sheet.addRule('.button').chainProp('color', 'navy')
  assert.equal(sheet.toCss(), '.button {\n  color: navy;\n}')
})

test('clones rules independently', () => {
  const original = new Rule('.button').chainProp('color', 'navy')
  const clone = original.clone()
  clone.props[0].setValue('red')
  assert.notEqual(original.toCss(), clone.toCss())
})
