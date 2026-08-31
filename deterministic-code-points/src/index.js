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

import { createHash } from 'node:crypto'

const UINT32_RANGE = 0x100000000

export default function deterministicCodePoints(alphabet, length, seed) {
  if (typeof alphabet !== 'string' || alphabet.length === 0) {
    throw new TypeError('alphabet must be a non-empty string')
  }
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError('length must be a non-negative integer')
  }
  if (typeof seed !== 'string' && !Buffer.isBuffer(seed)) {
    throw new TypeError('seed must be a string or Buffer')
  }

  const codePoints = [...alphabet]
  if (codePoints.length > UINT32_RANGE) {
    throw new RangeError('alphabet contains too many code points')
  }
  if (codePoints.length === 1) return codePoints[0].repeat(length)

  const seedBuffer = Buffer.isBuffer(seed) ? seed : Buffer.from(seed)
  const limit = Math.floor(UINT32_RANGE / codePoints.length) * codePoints.length
  let counter = 0
  let generated = 0
  let result = ''

  while (generated < length) {
    const counterBuffer = Buffer.allocUnsafe(4)
    counterBuffer.writeUInt32BE(counter)
    counter = (counter + 1) >>> 0
    const block = createHash('sha256')
      .update(seedBuffer)
      .update(counterBuffer)
      .digest()

    for (
      let offset = 0;
      offset < block.length && generated < length;
      offset += 4
    ) {
      const value = block.readUInt32BE(offset)
      if (value < limit) {
        result += codePoints[value % codePoints.length]
        generated += 1
      }
    }
  }

  return result
}
