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

import { Client as SshClient } from 'ssh2'

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

export default function sshUpdateNpm(connection, remoteDirectory) {
  if (typeof remoteDirectory !== 'string' || remoteDirectory.length === 0) {
    return Promise.reject(
      new TypeError('remoteDirectory must be a non-empty string'),
    )
  }

  const command = `cd -- ${shellEscape(remoteDirectory)} && npm update`

  return new Promise((resolve, reject) => {
    const client = new SshClient()
    let settled = false

    function fail(error) {
      if (!settled) {
        settled = true
        client.end()
        reject(error)
      }
    }

    client
      .once('ready', () => {
        client.exec(command, (error, stream) => {
          if (error) {
            fail(error)
            return
          }

          let stdout = ''
          let stderr = ''

          stream.on('data', (data) => {
            stdout += data.toString()
          })
          stream.stderr.on('data', (data) => {
            stderr += data.toString()
          })
          stream.once('close', (code) => {
            client.end()

            if (settled) return
            settled = true

            if (code !== 0) {
              reject(
                new Error(
                  `npm update failed with code ${code}` +
                    (stderr ? `: ${stderr.trim()}` : ''),
                ),
              )
              return
            }

            resolve({ stdout, stderr })
          })
        })
      })
      .once('error', fail)
      .connect(connection)
  })
}
