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

export default String.raw`(() => {
  const endpoint = __FASTIFY_REFRESH_ENDPOINT__
  let attempt = 0

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const socket = new WebSocket(protocol + '//' + window.location.host + endpoint)

    socket.addEventListener('open', () => {
      attempt = 0
    })

    socket.addEventListener('message', (event) => {
      let message
      try {
        message = JSON.parse(event.data)
      } catch {
        return
      }
      if (message.type === 'refresh') {
        window.location.reload()
      }
    })

    socket.addEventListener('close', () => {
      attempt += 1
      window.setTimeout(connect, Math.min(1000 * 2 ** attempt, 30000))
    })
  }

  connect()
})()`
