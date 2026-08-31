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

import fsSync from 'node:fs'
import fs from 'node:fs/promises'

export function read(filePath, options = 'utf8') {
  return fs.readFile(filePath, options)
}

export function write(filePath, data, options = 'utf8') {
  return fs.writeFile(filePath, data, options)
}

export function copy(source, destination, mode) {
  return fs.copyFile(source, destination, mode)
}

export function readSync(filePath, options = 'utf8') {
  return fsSync.readFileSync(filePath, options)
}

export function writeSync(filePath, data, options = 'utf8') {
  return fsSync.writeFileSync(filePath, data, options)
}

export function copySync(source, destination, mode) {
  return fsSync.copyFileSync(source, destination, mode)
}

export default { read, write, copy, readSync, writeSync, copySync }
