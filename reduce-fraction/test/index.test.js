import assert from 'node:assert/strict'
import test from 'node:test'
import reduceFraction from '../src/index.js'

test('reduces integer fractions', () => {
  assert.equal(reduceFraction(8, 12), '2/3')
  assert.equal(reduceFraction(7, 5), '7/5')
  assert.equal(reduceFraction(0, 25), '0/1')
})

test('normalizes the sign to the numerator', () => {
  assert.equal(reduceFraction(-8, 12), '-2/3')
  assert.equal(reduceFraction(8, -12), '-2/3')
  assert.equal(reduceFraction(-8, -12), '2/3')
})

test('requires a valid integer fraction', () => {
  assert.throws(() => reduceFraction(1.5, 2), /safe integer/)
  assert.throws(() => reduceFraction(1, Number.MAX_VALUE), /safe integer/)
  assert.throws(() => reduceFraction(1, 0), /must not be zero/)
})
