import assert from 'node:assert/strict'
import test from 'node:test'

import getCharacterSet, {
  asciiAlphanumeric,
  characterSetNames,
  decimalDigits,
  getEmojiCharacterSet,
  getHangulSyllables,
  getKanjiCharacterSet,
  kana,
  lowercaseLatinLetters,
  uppercaseLatinLetters,
} from '../src/index.js'

test('provides the ASCII character sets', () => {
  assert.equal(lowercaseLatinLetters.length, 26)
  assert.equal(uppercaseLatinLetters.length, 26)
  assert.equal(decimalDigits, '0123456789')
  assert.equal(asciiAlphanumeric.length, 62)
  assert.equal(getCharacterSet('ascii-alphanumeric'), asciiAlphanumeric)
})

test('provides kana and lazy Unicode range collections', () => {
  assert.equal(kana.includes('あ'), true)
  assert.equal(kana.includes('ア'), true)
  assert.equal(getHangulSyllables().startsWith('가'), true)
  assert.equal(getKanjiCharacterSet().includes('漢'), true)
})

test('removes overlaps from the emoji-derived collection', () => {
  const emoji = [...getEmojiCharacterSet()]
  assert.equal(emoji.includes('😀'), true)
  assert.equal(new Set(emoji).size, emoji.length)
})

test('enumerates and validates set names', () => {
  assert.equal(characterSetNames.includes('kanji'), true)
  assert.throws(() => getCharacterSet('missing'), RangeError)
})
