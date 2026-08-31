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

function getHeader(headers, name) {
  if (typeof headers?.get === 'function') return headers.get(name)

  const value = headers?.[name]
  return Array.isArray(value) ? value.join(',') : value
}

function firstForwardedAddress(value) {
  if (typeof value !== 'string') return undefined

  return value
    .split(',')
    .map((address) => address.trim())
    .find(Boolean)
}

export default function resolveRequestClientIp(
  request,
  { trustProxy = false, fallback = '0.0.0.0' } = {},
) {
  if (request === null || typeof request !== 'object') {
    throw new TypeError('request must be an object')
  }
  if (typeof trustProxy !== 'boolean') {
    throw new TypeError('trustProxy must be a boolean')
  }

  if (trustProxy) {
    const forwardedAddress = firstForwardedAddress(
      getHeader(request.headers, 'x-forwarded-for'),
    )

    if (forwardedAddress !== undefined) return forwardedAddress
    if (typeof request.ip === 'string' && request.ip !== '') return request.ip
  }

  return (
    request.socket?.remoteAddress ??
    request.connection?.remoteAddress ??
    fallback
  )
}
