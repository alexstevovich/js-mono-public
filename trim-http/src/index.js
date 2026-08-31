/*
 * MIT License
 *
 * Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com)
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

/**
 * Remove the http:// or https:// prefix from a URL string.
 * Safe, fast, and non-destructive for non-string or malformed inputs.
 *
 * @param {string} url - The input URL or text
 * @returns {string} - The same string without protocol prefix
 */
function trimHttp(url) {
  if (typeof url !== 'string') return url

  // Early exit for obviously short values
  if (url.length < 8) return url

  // Avoid regex for performance
  if (url.startsWith('https://')) return url.slice(8)
  if (url.startsWith('http://')) return url.slice(7)

  return url
}

export { trimHttp }
export default trimHttp
