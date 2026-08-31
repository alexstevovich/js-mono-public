/*
 * MIT License
 *
 * Copyright (c) 2025 Alex Stevovich (https://alexstevovich.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default function findCStyleCodeEndIndex(content) {
  if (typeof content !== 'string') {
    throw new TypeError('content must be a string')
  }

  let index = content.startsWith('#!') ? content.indexOf('\n') : 0
  if (index === -1) return -1
  let blockComment = false
  let lineComment = false
  let quote = null
  let escaped = false
  let lastCodeIndex = -1

  while (index < content.length) {
    const character = content[index]
    const next = content[index + 1]

    if (lineComment) {
      if (character === '\n') lineComment = false
    } else if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false
        index += 1
      }
    } else if (quote) {
      lastCodeIndex = index
      if (!escaped && character === quote) quote = null
      escaped = !escaped && character === '\\'
    } else if (character === '/' && next === '/') {
      lineComment = true
      index += 1
    } else if (character === '/' && next === '*') {
      blockComment = true
      index += 1
    } else if (!/\s/.test(character)) {
      lastCodeIndex = index
      if (character === "'" || character === '"' || character === '`') {
        quote = character
        escaped = false
      }
    }

    index += 1
  }

  return lastCodeIndex
}
