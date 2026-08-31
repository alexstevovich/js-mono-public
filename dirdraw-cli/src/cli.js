#!/usr/bin/env node

/*
 * ISC License
 * Copyright (c) 2025 Alex Stevovich
 */

import dirdraw from '@alexstevovich/dirdraw'

import commonIgnorePatterns from './vendor/common-ignore-patterns/index.js'

function help() {
  return `Usage: dirdraw [directory] [options]

Options:
  --depth <number>       Limit traversal depth
  --sizes <none|files|total>
  --no-gitignore        Do not read .gitignore
  --no-common-ignore    Include common generated and tooling paths
  --stroke <1|2|3>      Select line thickness
  -h, --help            Show this help`
}

function parseArguments(arguments_) {
  const options = {
    target: '.',
    depth: Infinity,
    sizeMode: 'total',
    ignoreRuleFiles: ['.gitignore'],
    globalIgnoreRules: [...commonIgnorePatterns],
    strokeThickness: 1,
  }
  let targetSet = false

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '-h' || argument === '--help') options.help = true
    else if (argument === '--no-gitignore') options.ignoreRuleFiles = []
    else if (argument === '--no-common-ignore') options.globalIgnoreRules = []
    else if (argument === '--depth') {
      options.depth = Number(arguments_[(index += 1)])
    } else if (argument === '--sizes') {
      const value = arguments_[(index += 1)]
      options.sizeMode = value === 'none' ? null : value
    } else if (argument === '--stroke') {
      options.strokeThickness = Number(arguments_[(index += 1)])
    } else if (!argument.startsWith('-') && !targetSet) {
      options.target = argument
      targetSet = true
    } else throw new Error(`Unknown argument: ${argument}`)
  }
  return options
}

async function main() {
  const {
    target,
    help: showHelp,
    ...options
  } = parseArguments(process.argv.slice(2))
  if (showHelp) {
    console.log(help())
    return
  }
  console.log(await dirdraw(target, options))
}

main().catch((error) => {
  console.error(`dirdraw: ${error.message}`)
  process.exitCode = 1
})
