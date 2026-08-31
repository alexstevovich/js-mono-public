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

function formatDelimiter(template, filePath) {
  return template
    .replaceAll('{{PATH}}', filePath)
    .replaceAll('{{PATH_ABS}}', path.resolve(filePath))
}

export default async function readFilesToString(
  paths,
  { encoding = 'utf8', concurrency = 'sequential', delimiter = '' } = {},
) {
  if (
    !Array.isArray(paths) ||
    paths.some((value) => typeof value !== 'string')
  ) {
    throw new TypeError('paths must be an array of strings')
  }
  if (concurrency !== 'sequential' && concurrency !== 'parallel') {
    throw new RangeError("concurrency must be 'sequential' or 'parallel'")
  }
  if (typeof delimiter !== 'string') {
    throw new TypeError('delimiter must be a string')
  }

  const read = async (filePath) => {
    const content = await fs.readFile(filePath, encoding)
    return `${formatDelimiter(delimiter, filePath)}${content}`
  }

  if (concurrency === 'parallel') {
    return (await Promise.all(paths.map(read))).join('')
  }

  let result = ''
  for (const filePath of paths) result += await read(filePath)
  return result
}
