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

import fs from 'node:fs/promises'
import path from 'node:path'

export default async function clearDirSafer(
  directory,
  expectedDirectoryName,
  minimumPathLength = 20,
) {
  if (!directory) {
    throw new Error('directory is required')
  }

  if (!expectedDirectoryName) {
    throw new Error('expectedDirectoryName is required')
  }

  const resolved = path.resolve(directory)
  const actualDirectoryName = path.basename(resolved)

  if (resolved.length < minimumPathLength) {
    throw new Error(`Refusing to clear suspiciously short path: ${resolved}`)
  }

  if (actualDirectoryName !== expectedDirectoryName) {
    throw new Error(
      'Refusing to clear directory with unexpected name.\n' +
        `Expected: ${expectedDirectoryName}\n` +
        `Actual: ${actualDirectoryName}\n` +
        `Path: ${resolved}`,
    )
  }

  await fs.rm(resolved, { recursive: true, force: true })
  await fs.mkdir(resolved, { recursive: true })
}
