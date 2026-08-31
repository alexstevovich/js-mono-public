/*
 * MIT License
 *
 * Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com)
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

function product(dimensions, name) {
  if (
    !Array.isArray(dimensions) ||
    dimensions.length === 0 ||
    dimensions.some((value) => !Number.isFinite(value) || value < 0)
  ) {
    throw new TypeError(`${name} must contain non-negative finite numbers`)
  }
  return dimensions.reduce((total, value) => total * value, 1)
}

export default function productVolumePercent(dimensions, reference) {
  if (!Array.isArray(reference) || dimensions.length !== reference.length) {
    throw new RangeError('dimensions and reference must have the same length')
  }

  const value = product(dimensions, 'dimensions')
  const referenceValue = product(reference, 'reference')
  if (referenceValue === 0) return value === 0 ? 0 : Infinity
  return (value / referenceValue) * 100
}
