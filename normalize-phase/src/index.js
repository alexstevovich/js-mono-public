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

export default function normalizePhase(
  value,
  { minimum = 0, maximum = 1, cyclic = false } = {},
) {
  for (const [name, candidate] of Object.entries({ value, minimum, maximum })) {
    if (typeof candidate !== 'number' || !Number.isFinite(candidate)) {
      throw new TypeError(`${name} must be a finite number`)
    }
  }
  if (maximum <= minimum) {
    throw new RangeError('maximum must be greater than minimum')
  }
  if (typeof cyclic !== 'boolean') {
    throw new TypeError('cyclic must be a boolean')
  }

  const span = maximum - minimum
  if (cyclic) {
    return ((((value - minimum) % span) + span) % span) / span
  }
  if (value < minimum || value > maximum) {
    throw new RangeError('value must be within the configured interval')
  }
  return (value - minimum) / span
}

export { normalizePhase }
