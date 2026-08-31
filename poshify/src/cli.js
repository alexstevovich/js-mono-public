#!/usr/bin/env node

/*
 * Copyright 2018-2025 Alex Stevovich
 * Licensed under the Apache License, Version 2.0.
 */

import path from 'node:path'

import { sortAndSavePackageJson } from './index.js'

const argument = process.argv[2]

if (argument === '--help' || argument === '-h') {
  console.log('Usage: poshify [directory]')
} else {
  const directory = path.resolve(argument ?? '.')
  sortAndSavePackageJson(directory)
    .then(() => console.log(`Sorted ${path.join(directory, 'package.json')}`))
    .catch((error) => {
      console.error(`poshify: ${error.message}`)
      process.exitCode = 1
    })
}
