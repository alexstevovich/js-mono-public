/*
 * discordchan
 *
 * Copyright 2020 Alex Stevovich
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

class DiscordChan {
  /**
   * @param {string|null} webhook - Discord webhook URL
   * @param {object} [options]
   * @param {boolean} [options.dryRun=false] - if true, log instead of sending
   */
  constructor(webhook, { dryRun = false } = {}) {
    this.webhook = webhook ?? null
    this.dryRun = dryRun
  }

  dryRunMode(enable = true) {
    this.dryRun = enable
    return this
  }

  discordifyData(json) {
    return '```json\n' + JSON.stringify(json, null, 2) + '\n```'
  }

  verify() {
    return (
      typeof this.webhook === 'string' && this.webhook.startsWith('https://')
    )
  }

  ensure() {
    if (!this.verify()) {
      throw new Error('[DiscordChan] Missing or invalid webhook URL')
    }
    return this
  }

  async send(content) {
    if (this.dryRun) {
      console.log('💬 [DiscordChan:SIMULATED]', content)
      return { simulated: true }
    }

    this.ensure()

    const payload =
      typeof content === 'object'
        ? { content: this.discordifyData(content) }
        : { content: String(content) }

    const response = await fetch(this.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`[DiscordChan] Failed (${response.status}): ${text}`)
    }

    return response
  }
}

export { DiscordChan }
export default DiscordChan
