/*
 * ISC License
 *
 * Copyright (c) 2025 Alex Stevovich
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import unicodeRange from './vendor/unicode-range/index.js'

export const lowercaseLatinLetters = 'abcdefghijklmnopqrstuvwxyz'
export const uppercaseLatinLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const latinLetters = uppercaseLatinLetters + lowercaseLatinLetters
export const decimalDigits = '0123456789'
export const asciiAlphanumeric = latinLetters + decimalDigits
export const lowercaseAsciiAlphanumeric = lowercaseLatinLetters + decimalDigits
export const uppercaseAsciiAlphanumeric = uppercaseLatinLetters + decimalDigits

const hiraganaModern =
  'ぁあぃいぅうぇえぉおかがきぎくぐけげこご' +
  'さざしじすずせぜそぞただちぢっつづてでとど' +
  'なにぬねのはばぱひびぴふぶぷへべぺほぼぽ' +
  'まみむめもゃやゅゆょよらりるれろゎわをんゔ'
const hiraganaObsolete = 'ゐゑゕゖ゘ゝゞゟ'
const katakanaModern =
  'ァアィイゥウェエォオカガキギクグケゲコゴ' +
  'サザシジスズセゼソゾタダチヂッツヅテデトド' +
  'ナニヌネノハバパヒビピフブプヘベペホボポ' +
  'マミムメモャヤュユョヨラリルレロヮワヲンヴ'
const katakanaObsolete = 'ヰヱヵヶヷヸヹヺヿヽヾ'
const kanaMarks = '゛゜・ー゠'

export const kana =
  hiraganaModern +
  hiraganaObsolete +
  katakanaModern +
  katakanaObsolete +
  kanaMarks

const ranges = {
  hangul: [[0xac00, 0xd7a3]],
  chinese: [
    [0x4e00, 0x9fff],
    [0x3400, 0x4dbf],
    [0xf900, 0xfaff],
    [0x3000, 0x303f],
    [0x3100, 0x312f],
    [0x31a0, 0x31bf],
    [0x2f00, 0x2fdf],
    [0x2ff0, 0x2fff],
  ],
  kanji: [
    [0x4e00, 0x9fff],
    [0x3400, 0x4dbf],
    [0x20000, 0x2a6df],
    [0x2a700, 0x2b73f],
    [0x2b740, 0x2b81f],
    [0x2b820, 0x2ceaf],
    [0x2ceb0, 0x2ebef],
    [0x30000, 0x3134f],
    [0x31350, 0x323af],
  ],
  emoji: [
    [0x1f600, 0x1f64f],
    [0x2600, 0x26ff],
    [0x2700, 0x27bf],
    [0x1f680, 0x1f6ff],
    [0x1f5fa, 0x1f5ff],
    [0x1f900, 0x1f9ff],
    [0x1f300, 0x1f5ff],
    [0x1fa70, 0x1faff],
    [0x1f490, 0x1f49f],
    [0x1f1e6, 0x1f1ff],
  ],
}

const cache = new Map()

function fromRanges(name, unique = false) {
  if (cache.has(name)) return cache.get(name)

  const value = unique
    ? [
        ...new Set(
          ranges[name].flatMap(([start, end]) => [...unicodeRange(start, end)]),
        ),
      ].join('')
    : ranges[name].map(([start, end]) => unicodeRange(start, end)).join('')

  cache.set(name, value)
  return value
}

export function getHangulSyllables() {
  return fromRanges('hangul')
}

export function getChineseCharacterSet() {
  return fromRanges('chinese')
}

export function getKanjiCharacterSet() {
  return fromRanges('kanji')
}

export function getEmojiCharacterSet() {
  return fromRanges('emoji', true)
}

const characterSets = {
  'ascii-lowercase': () => lowercaseLatinLetters,
  'ascii-uppercase': () => uppercaseLatinLetters,
  'ascii-letters': () => latinLetters,
  'decimal-digits': () => decimalDigits,
  'ascii-alphanumeric': () => asciiAlphanumeric,
  'ascii-alphanumeric-lowercase': () => lowercaseAsciiAlphanumeric,
  'ascii-alphanumeric-uppercase': () => uppercaseAsciiAlphanumeric,
  kana: () => kana,
  hangul: getHangulSyllables,
  chinese: getChineseCharacterSet,
  kanji: getKanjiCharacterSet,
  emoji: getEmojiCharacterSet,
}

export const characterSetNames = Object.freeze(Object.keys(characterSets))

export function getCharacterSet(name) {
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string')
  }

  const create = characterSets[name]
  if (!create) throw new RangeError(`unknown character set: ${name}`)
  return create()
}

export default getCharacterSet
