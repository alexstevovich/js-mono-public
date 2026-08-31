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

const escape = '\u001b['

function hexToRgb(value, optionName) {
  if (typeof value !== 'string' || !/^#?[\da-f]{6}$/i.test(value)) {
    throw new TypeError(`${optionName} must be a six-digit hexadecimal color`)
  }

  const hex = value.replace(/^#/, '')
  return [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  )
}

export default function styleTerminalText(
  text,
  {
    color,
    backgroundColor,
    bold = false,
    dim = false,
    italic = false,
    underline = false,
    blink = false,
    inverse = false,
    strikethrough = false,
  } = {},
) {
  if (typeof text !== 'string') throw new TypeError('text must be a string')

  const codes = []
  if (bold) codes.push(1)
  if (dim) codes.push(2)
  if (italic) codes.push(3)
  if (underline) codes.push(4)
  if (blink) codes.push(5)
  if (inverse) codes.push(7)
  if (strikethrough) codes.push(9)
  if (color !== undefined) codes.push(38, 2, ...hexToRgb(color, 'color'))
  if (backgroundColor !== undefined) {
    codes.push(48, 2, ...hexToRgb(backgroundColor, 'backgroundColor'))
  }

  return codes.length === 0
    ? text
    : `${escape}${codes.join(';')}m${text}${escape}0m`
}

export { styleTerminalText }
