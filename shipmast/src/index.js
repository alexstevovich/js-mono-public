/*
 * Copyright 2022 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import isValidUuid from './vendor/is-valid-uuid/index.js'
import partitionCStyleSource from './vendor/partition-c-style-source/index.js'

const SHIPMAST_PATTERN = /\/\*˹([\s\S]*?)˼\*\/(?:\r?\n)?/

function hash(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

function normalizeData(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('data must be an object')
  }

  const { pre = {}, post = {}, ...values } = data
  return { ...pre, ...post, ...values }
}

function normalizeKeys(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key.replace(/^\$/, ''),
      value,
    ]),
  )
}

function renderTemplate(template, values) {
  return template.replace(/{{\$?([a-zA-Z0-9_]+)}}/g, (placeholder, name) =>
    values[name] === undefined ? placeholder : String(values[name]),
  )
}

function parseShipmastFields(mast) {
  const fields = {}
  for (const line of mast.split(/\r?\n/)) {
    const match = line.trim().match(/(?:.*\s)?([a-zA-Z0-9_]+)\s*:\s*(.*)$/)
    if (match) fields[match[1]] = match[2].trim()
  }
  return fields
}

function splitShipmast(content) {
  const { shebang, header, body, footer } = partitionCStyleSource(content)
  const match = SHIPMAST_PATTERN.exec(header)

  if (!match) {
    return {
      before: shebang,
      mast: null,
      after: header + body + footer,
    }
  }

  return {
    before: shebang + header.slice(0, match.index),
    mast: match[1],
    after: header.slice(match.index + match[0].length) + body + footer,
  }
}

function stableHash(template, values) {
  return hash(
    renderTemplate(template, {
      ...values,
      generated_on_iso: '{{generated_on_iso}}',
      file_hash: '{{file_hash}}',
      mast_hash: '{{mast_hash}}',
    }),
  )
}

export function applyShipmast(
  content,
  template,
  {
    data = {},
    filePath,
    rootDirectory = process.cwd(),
    generatedOn,
    uuid,
  } = {},
) {
  if (typeof content !== 'string') {
    throw new TypeError('content must be a string')
  }
  if (typeof template !== 'string' || template.length === 0) {
    throw new TypeError('template must be a non-empty string')
  }

  const { before, mast, after } = splitShipmast(content)
  const document = before + after
  const existing = mast ? parseShipmastFields(mast) : {}
  const supplied = normalizeKeys(normalizeData(data))
  const fileUuid = isValidUuid(existing.file_uuid)
    ? existing.file_uuid
    : uuid || randomUUID()
  const relativeFile = filePath
    ? path.relative(rootDirectory, filePath).replaceAll('\\', '/')
    : supplied.file_path_relative ||
      existing.file_path_relative ||
      existing.file_name
  const size = Buffer.byteLength(document, 'utf8')
  const values = {
    ...existing,
    ...supplied,
    year_full: new Date().getFullYear(),
    file_uuid: fileUuid,
    file_path_relative: relativeFile,
    file_size: size,
    file_size_bytes: `${size} bytes`,
    generated_by: 'shipmast',
  }
  const fileHash = hash(document)
  const mastHash = stableHash(template, values)
  const updated =
    mast === null ||
    existing.file_hash !== fileHash ||
    existing.mast_hash !== mastHash

  if (!updated) {
    return { content, metadata: values, updated: false }
  }

  const finalValues = {
    ...values,
    generated_on_iso: generatedOn || new Date().toISOString(),
    file_hash: fileHash,
    mast_hash: mastHash,
  }
  const renderedMast = renderTemplate(template, finalValues)

  return {
    content: `${before}/*˹${renderedMast}˼*/\n${after}`,
    metadata: finalValues,
    updated: true,
  }
}

export function removeShipmast(content) {
  if (typeof content !== 'string') {
    throw new TypeError('content must be a string')
  }

  const { before, mast, after } = splitShipmast(content)
  return mast === null ? content : before + after
}

export async function applyShipmastToFile(
  filePath,
  template,
  { dryRun = false, ...options } = {},
) {
  const absolutePath = path.resolve(filePath)
  const content = await fs.readFile(absolutePath, 'utf8')
  const result = applyShipmast(content, template, {
    ...options,
    filePath: absolutePath,
  })

  if (result.updated && !dryRun) {
    await fs.writeFile(absolutePath, result.content, 'utf8')
  }

  return { ...result, filePath: absolutePath }
}

export async function removeShipmastFromFile(
  filePath,
  { dryRun = false } = {},
) {
  const absolutePath = path.resolve(filePath)
  const content = await fs.readFile(absolutePath, 'utf8')
  const cleaned = removeShipmast(content)
  const updated = cleaned !== content

  if (updated && !dryRun) await fs.writeFile(absolutePath, cleaned, 'utf8')

  return { content: cleaned, filePath: absolutePath, updated }
}

export default applyShipmast
