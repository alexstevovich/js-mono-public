#!/usr/bin/env node

import runShipmastCli from './index.js'

try {
  await runShipmastCli(process.argv.slice(2))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
