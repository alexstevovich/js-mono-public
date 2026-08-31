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

export default function capProductVolume(dimensions, maximumVolume) {
  if (!Array.isArray(dimensions) || dimensions.length === 0) {
    throw new TypeError('dimensions must be a non-empty array')
  }

  if (
    dimensions.some((dimension) => !Number.isFinite(dimension) || dimension < 0)
  ) {
    throw new TypeError('dimensions must contain non-negative finite numbers')
  }

  if (!Number.isFinite(maximumVolume) || maximumVolume <= 0) {
    throw new TypeError('maximumVolume must be a positive finite number')
  }

  const volume = dimensions.reduce(
    (product, dimension) => product * dimension,
    1,
  )

  if (volume <= maximumVolume) return [...dimensions]

  const scale = (maximumVolume / volume) ** (1 / dimensions.length)
  return dimensions.map((dimension) => dimension * scale)
}

export { capProductVolume }
