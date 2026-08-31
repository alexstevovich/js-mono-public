/*
 * ISC License
 *
 * Copyright (c) 2025 Alex Stevovich
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import { stdin, stdout } from 'node:process'
import readline from 'node:readline/promises'

export default async function promptTerminal(
  promptText = '?',
  { input = stdin, output = stdout, trim = true } = {},
) {
  if (typeof promptText !== 'string') {
    throw new TypeError('promptText must be a string')
  }
  if (typeof trim !== 'boolean') throw new TypeError('trim must be a boolean')

  const interface_ = readline.createInterface({ input, output })
  const prompt = /\s$/.test(promptText) ? promptText : `${promptText} `

  try {
    const answer = await interface_.question(prompt)
    return trim ? answer.trim() : answer
  } finally {
    interface_.close()
  }
}

export { promptTerminal }
