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

const ENTRY_TYPES = new Set(['file', 'dir', 'link'])

function has(entry, key) {
  return Object.prototype.hasOwnProperty.call(entry, key)
}

function comparePaths(a, b) {
  const aPath = a.path ?? a.source.path
  const bPath = b.path ?? b.source.path

  return aPath < bPath ? -1 : aPath > bPath ? 1 : 0
}

function createIndex(manifest, name) {
  if (!Array.isArray(manifest)) {
    throw new TypeError(`${name} manifest must be an array`)
  }

  const index = new Map()

  for (const entry of manifest) {
    if (!entry || typeof entry !== 'object') {
      throw new TypeError(`${name} manifest entries must be objects`)
    }

    if (typeof entry.path !== 'string' || entry.path.length === 0) {
      throw new TypeError(
        `${name} manifest entry path must be a non-empty string`,
      )
    }

    if (!ENTRY_TYPES.has(entry.type)) {
      throw new TypeError(
        `${name} manifest entry "${entry.path}" has an invalid type`,
      )
    }

    if (index.has(entry.path)) {
      throw new Error(`Duplicate path in ${name} manifest: ${entry.path}`)
    }

    index.set(entry.path, entry)
  }

  return index
}

function requireField(entry, field, manifestName) {
  if (!has(entry, field)) {
    throw new Error(
      `Cannot compare "${field}" for "${entry.path}": ` +
        `field missing from ${manifestName} manifest`,
    )
  }
}

function validateComparisonFields(manifest, manifestName, options) {
  for (const entry of manifest) {
    if (options.mtimeMs) {
      requireField(entry, 'mtimeMs', manifestName)
    }

    if (entry.type === 'file') {
      if (options.size) {
        requireField(entry, 'size', manifestName)
      }

      if (options.hash) {
        requireField(entry, 'hash', manifestName)
      }
    }

    if (entry.type === 'link' && options.linkTarget) {
      requireField(entry, 'target', manifestName)
    }
  }
}

export default function diffManifests(source = [], target = [], options = {}) {
  const comparison = {
    size: options.size ?? false,
    mtimeMs: options.mtimeMs ?? false,
    hash: options.hash ?? false,
    linkTarget: options.linkTarget ?? true,
  }

  const sourceIndex = createIndex(source, 'source')
  const targetIndex = createIndex(target, 'target')

  validateComparisonFields(source, 'source', comparison)
  validateComparisonFields(target, 'target', comparison)

  const add = []
  const remove = []
  const change = []
  const same = []

  function changedFields(sourceEntry, targetEntry) {
    const fields = []

    if (sourceEntry.type !== targetEntry.type) {
      fields.push('type')
    }

    if (
      comparison.size &&
      sourceEntry.type === 'file' &&
      targetEntry.type === 'file' &&
      sourceEntry.size !== targetEntry.size
    ) {
      fields.push('size')
    }

    if (comparison.mtimeMs && sourceEntry.mtimeMs !== targetEntry.mtimeMs) {
      fields.push('mtimeMs')
    }

    if (
      comparison.hash &&
      sourceEntry.type === 'file' &&
      targetEntry.type === 'file' &&
      sourceEntry.hash !== targetEntry.hash
    ) {
      fields.push('hash')
    }

    if (
      comparison.linkTarget &&
      sourceEntry.type === 'link' &&
      targetEntry.type === 'link' &&
      sourceEntry.target !== targetEntry.target
    ) {
      fields.push('target')
    }

    return fields
  }

  for (const sourceEntry of source) {
    const targetEntry = targetIndex.get(sourceEntry.path)

    if (!targetEntry) {
      add.push(sourceEntry)
      continue
    }

    const fields = changedFields(sourceEntry, targetEntry)

    if (fields.length === 0) {
      same.push({ source: sourceEntry, target: targetEntry })
    } else {
      change.push({ source: sourceEntry, target: targetEntry, fields })
    }
  }

  for (const targetEntry of target) {
    if (!sourceIndex.has(targetEntry.path)) {
      remove.push(targetEntry)
    }
  }

  add.sort(comparePaths)
  remove.sort(comparePaths)
  change.sort(comparePaths)
  same.sort(comparePaths)

  return { add, remove, change, same }
}
