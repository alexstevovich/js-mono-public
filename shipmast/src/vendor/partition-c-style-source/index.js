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

import findCStyleCodeEndIndex from './vendor/find-c-style-code-end-index/index.js'
import findCStyleCodeStartIndex from './vendor/find-c-style-code-start-index/index.js'
import extractShebang from './vendor/extract-shebang/index.js'

export function partitionCStyleSource(content) {
  const { shebang, content: source } = extractShebang(content)
  const startIndex = findCStyleCodeStartIndex(source)
  const endIndex = findCStyleCodeEndIndex(source)

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return { shebang, header: source, body: '', footer: '' }
  }

  const bodyEnd = endIndex + 1

  return {
    shebang,
    header: source.slice(0, startIndex),
    body: source.slice(startIndex, bodyEnd),
    footer: source.slice(bodyEnd),
  }
}

export default partitionCStyleSource
