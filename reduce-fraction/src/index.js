/*
 * MIT License
 *
 * Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com)
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

export default function reduceFraction(numerator, denominator) {
  if (!Number.isSafeInteger(numerator)) {
    throw new TypeError('numerator must be a safe integer')
  }
  if (!Number.isSafeInteger(denominator)) {
    throw new TypeError('denominator must be a safe integer')
  }
  if (denominator === 0) {
    throw new RangeError('denominator must not be zero')
  }

  let a = Math.abs(numerator)
  let b = Math.abs(denominator)

  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }

  const sign = denominator < 0 ? -1 : 1
  return `${(numerator / a) * sign}/${Math.abs(denominator / a)}`
}
