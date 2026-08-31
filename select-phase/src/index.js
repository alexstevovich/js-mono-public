/*
 * Copyright 2015 Alex Stevovich
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

function validateStarts(starts) {
  if (!Array.isArray(starts) || starts.length === 0) {
    throw new TypeError('starts must be a non-empty array')
  }

  for (const [index, start] of starts.entries()) {
    if (typeof start !== 'number' || !Number.isFinite(start)) {
      throw new TypeError('every phase start must be a finite number')
    }
    if (start < 0 || start > 1) {
      throw new RangeError('every phase start must be between 0 and 1')
    }
    if (index > 0 && start <= starts[index - 1]) {
      throw new RangeError('phase starts must be strictly increasing')
    }
  }
}

export default function selectPhase(starts, position, { cyclic = true } = {}) {
  validateStarts(starts)
  if (
    typeof position !== 'number' ||
    !Number.isFinite(position) ||
    position < 0 ||
    position > 1
  ) {
    throw new RangeError('position must be a number between 0 and 1')
  }
  if (typeof cyclic !== 'boolean') {
    throw new TypeError('cyclic must be a boolean')
  }

  for (let index = starts.length - 1; index >= 0; index -= 1) {
    if (position >= starts[index]) return index
  }

  return cyclic ? starts.length - 1 : -1
}

export { selectPhase }
