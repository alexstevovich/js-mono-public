#!/usr/bin/env node

import runFilezordCli from './index.js'

try {
  await runFilezordCli()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
