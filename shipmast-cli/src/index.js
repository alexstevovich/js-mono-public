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

import {
  applyShipmastToFile,
  removeShipmastFromFile,
} from '@alexstevovich/shipmast'
import { glob } from 'glob'

export const helpText = `Usage:
  shipmast [--apply] <glob...> [--template <file>] [--data <json>] [--dry-run]
  shipmast --remove <glob...> [--dry-run]

Options:
  --apply            Apply or update Shipmast headers (default)
  --remove           Remove Shipmast headers
  --template <file>  Template file (default: ./.shipmast)
  --data <json>      Additional template values
  --dry-run          Report changes without writing files
  --help             Show this help text`

function parseArguments(arguments_) {
  const options = {
    data: {},
    dryRun: false,
    help: false,
    mode: 'apply',
    patterns: [],
    templatePath: './.shipmast',
  }

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--help') options.help = true
    else if (argument === '--apply') options.mode = 'apply'
    else if (argument === '--remove') options.mode = 'remove'
    else if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--template') {
      options.templatePath = arguments_[index + 1]
      index += 1
      if (!options.templatePath) throw new Error('--template requires a file')
    } else if (argument === '--data') {
      const source = arguments_[index + 1]
      index += 1
      if (!source) throw new Error('--data requires JSON')
      try {
        options.data = JSON.parse(source)
      } catch (error) {
        throw new Error(`invalid --data JSON: ${error.message}`, {
          cause: error,
        })
      }
    } else if (argument.startsWith('--')) {
      throw new Error(`unknown option: ${argument}`)
    } else {
      options.patterns.push(argument)
    }
  }

  return options
}

export default async function runShipmastCli(
  arguments_,
  { cwd = process.cwd(), stdout = process.stdout } = {},
) {
  const options = parseArguments(arguments_)
  if (options.help) {
    stdout.write(`${helpText}\n`)
    return { matched: 0, updated: 0 }
  }
  if (options.patterns.length === 0)
    throw new Error('at least one glob is required')

  const files = await glob(options.patterns, {
    absolute: true,
    cwd,
    nodir: true,
  })
  let template
  if (options.mode === 'apply') {
    template = await fs.readFile(
      path.resolve(cwd, options.templatePath),
      'utf8',
    )
  }

  let updated = 0
  for (const file of files) {
    const result =
      options.mode === 'remove'
        ? await removeShipmastFromFile(file, { dryRun: options.dryRun })
        : await applyShipmastToFile(file, template, {
            data: options.data,
            dryRun: options.dryRun,
            rootDirectory: path.resolve(cwd),
          })
    if (result.updated) updated += 1
  }

  stdout.write(`Files visited: ${files.length}\n`)
  stdout.write(
    `Files ${options.dryRun ? 'would update' : 'updated'}: ${updated}\n`,
  )
  return { matched: files.length, updated }
}

export { parseArguments, runShipmastCli }
