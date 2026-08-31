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

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

export default async function copyDir(sourceDirectory, targetDirectory) {
  if (!sourceDirectory) throw new Error('sourceDirectory is required')
  if (!targetDirectory) throw new Error('targetDirectory is required')

  const sourceRoot = path.resolve(sourceDirectory)
  const targetRoot = path.resolve(targetDirectory)
  const files = await walkFiles(sourceRoot)

  for (const sourceFile of files) {
    const relativePath = path.relative(sourceRoot, sourceFile)
    const targetFile = path.join(targetRoot, relativePath)

    await fs.mkdir(path.dirname(targetFile), { recursive: true })
    await fs.copyFile(sourceFile, targetFile)
  }
}
