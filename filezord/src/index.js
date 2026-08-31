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

import fs from 'node:fs/promises'
import path from 'node:path'

export const defaultFilezordHeader = `======================================================
FILEZORD AGGREGATION
Generated on: {generatedOn}
Start path: {root}
Total files: {fileCount}
Identifier: {id}
Filezords are intended for communication and review.
======================================================`

export const defaultFilezordFileHeader = `------------------------------------------------------
FILE: {file}
START: {root}
------------------------------------------------------`

function fill(template, values) {
  let output = template
  for (const [name, value] of Object.entries(values)) {
    output = output.replaceAll(`{${name}}`, String(value))
  }
  return output
}

export default async function filezord(
  filePaths,
  {
    id = 'None',
    rootDirectory = process.cwd(),
    headerTemplate = defaultFilezordHeader,
    fileHeaderTemplate = defaultFilezordFileHeader,
  } = {},
) {
  const root = rootDirectory.replaceAll('\\', '/')
  const values = {
    fileCount: filePaths.length,
    generatedOn: new Date().toISOString(),
    id,
    root,
  }
  const output = [fill(headerTemplate, values)]
  const contents = await Promise.all(
    filePaths.map(async (file) => {
      try {
        return await fs.readFile(file, 'utf8')
      } catch (error) {
        return `Failed to read file: ${error.message}`
      }
    }),
  )

  for (const [index, file] of filePaths.entries()) {
    const relativeFile = path
      .relative(rootDirectory, file)
      .replaceAll('\\', '/')
    output.push(fill(fileHeaderTemplate, { ...values, file: relativeFile }))
    output.push(contents[index])
  }

  return output.join('\n\n')
}

export { filezord }
