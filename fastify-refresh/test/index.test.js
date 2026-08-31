import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import test from 'node:test'

import { fastifyRefresh } from '../src/index.js'

function fakeFastify() {
  const routes = []
  const hooks = new Map()
  return {
    routes,
    hooks,
    websocketServer: {},
    addHook(name, handler) {
      hooks.set(name, handler)
    },
    decorate(name, value) {
      this[name] = value
    },
    get(route, options, handler) {
      if (handler === undefined) {
        handler = options
        options = {}
      }
      routes.push({ handler, method: 'GET', options, route })
    },
    post(route, handler) {
      routes.push({ handler, method: 'POST', route })
    },
  }
}

test('registers routes, injects its client, and refreshes open sockets', async () => {
  const fastify = fakeFastify()
  await fastifyRefresh(fastify, { triggerRoute: '/refresh' })

  const socketRoute = fastify.routes.find(({ options }) => options?.websocket)
  const socket = Object.assign(new EventEmitter(), {
    close() {},
    readyState: 1,
    sent: [],
    send(message) {
      this.sent.push(message)
    },
  })
  socketRoute.handler(socket)

  assert.equal(fastify.refreshClients(), 1)
  assert.deepEqual(JSON.parse(socket.sent[0]), { type: 'refresh' })

  const html = await new Promise((resolve, reject) => {
    fastify.hooks.get('onSend')(
      {},
      { getHeader: () => 'text/html; charset=utf-8' },
      '<html><head></head></html>',
      (error, value) => (error ? reject(error) : resolve(value)),
    )
  })
  assert.match(html, /<script src="\/__fastify_refresh\/client\.js">/)
})

test('requires the websocket plugin to be registered first', async () => {
  const fastify = fakeFastify()
  delete fastify.websocketServer
  await assert.rejects(
    () => fastifyRefresh(fastify),
    /must be registered first/,
  )
})
