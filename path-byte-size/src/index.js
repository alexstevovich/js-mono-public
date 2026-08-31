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

import fs from 'node:fs/promises'
import path from 'node:path'

async function measure(target, onError) {
  try {
    const stat = await fs.lstat(target)
    if (stat.isFile()) return stat.size
    if (!stat.isDirectory()) return 0

    const entries = await fs.readdir(target)
    const sizes = await Promise.all(
      entries.map((entry) => measure(path.join(target, entry), onError)),
    )
    return sizes.reduce((total, size) => total + size, 0)
  } catch (error) {
    if (onError === 'ignore') return 0
    throw error
  }
}

export default function pathByteSize(target, { onError = 'throw' } = {}) {
  if (typeof target !== 'string' || target.length === 0) {
    throw new TypeError('target must be a non-empty string')
  }
  if (onError !== 'throw' && onError !== 'ignore') {
    throw new RangeError("onError must be 'throw' or 'ignore'")
  }
  return measure(target, onError)
}
