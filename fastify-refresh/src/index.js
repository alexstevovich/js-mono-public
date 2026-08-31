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

import fastifyPlugin from 'fastify-plugin'

import clientSource from './client.js'

const defaultSocketRoute = '/__fastify_refresh/socket'
const defaultScriptRoute = '/__fastify_refresh/client.js'

function validateRoute(value, name) {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    throw new TypeError(`${name} must be an absolute URL path`)
  }
  return value
}

async function plugin(fastify, options = {}) {
  if (!fastify.websocketServer) {
    throw new Error('@fastify/websocket must be registered first')
  }

  const socketRoute = validateRoute(
    options.socketRoute ?? defaultSocketRoute,
    'socketRoute',
  )
  const scriptRoute = validateRoute(
    options.scriptRoute ?? defaultScriptRoute,
    'scriptRoute',
  )
  const triggerRoute =
    options.triggerRoute === undefined
      ? undefined
      : validateRoute(options.triggerRoute, 'triggerRoute')
  const clients = new Set()

  fastify.get(scriptRoute, (_request, reply) => {
    const source = clientSource.replace(
      '__FASTIFY_REFRESH_ENDPOINT__',
      JSON.stringify(socketRoute),
    )
    return reply.type('application/javascript; charset=utf-8').send(source)
  })

  fastify.get(socketRoute, { websocket: true }, (socket) => {
    clients.add(socket)
    const discard = () => clients.delete(socket)
    socket.once('close', discard)
    socket.once('error', discard)
  })

  fastify.addHook('onSend', (_request, reply, payload, done) => {
    const contentType = reply.getHeader('content-type')
    if (
      typeof contentType !== 'string' ||
      !contentType.toLowerCase().includes('text/html') ||
      (!Buffer.isBuffer(payload) && typeof payload !== 'string')
    ) {
      done(null, payload)
      return
    }

    const html = payload.toString()
    const tag = `<script src="${scriptRoute}"></script>`
    const insertion = html.search(/<\/head\s*>/i)
    const updated =
      insertion === -1
        ? `${html}\n${tag}`
        : `${html.slice(0, insertion)}${tag}\n${html.slice(insertion)}`
    done(null, updated)
  })

  fastify.decorate('refreshClients', () => {
    let refreshed = 0
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: 'refresh' }))
        refreshed += 1
      } else {
        clients.delete(client)
      }
    }
    return refreshed
  })

  if (triggerRoute !== undefined) {
    fastify.post(triggerRoute, () => ({ refreshed: fastify.refreshClients() }))
  }

  fastify.addHook('onClose', (_instance, done) => {
    for (const client of clients) {
      client.close()
    }
    clients.clear()
    done()
  })
}

export { plugin as fastifyRefresh }
export default fastifyPlugin(plugin, {
  name: 'fastify-refresh',
  dependencies: ['@fastify/websocket'],
})
