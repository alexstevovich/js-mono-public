/*
 * Copyright 2017 Alex Stevovich
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

import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

function nonNegativeNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative finite number`)
  }
  return value
}

function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError(`${name} must be a positive safe integer`)
  }
  return value
}

function queryLimit(value) {
  return positiveInteger(value, 'limit')
}

export default class AcidLog {
  constructor(
    filePath,
    { retentionDays = 5, maxEntries = 10_000, logger = console } = {},
  ) {
    if (typeof filePath !== 'string' || filePath.length === 0) {
      throw new TypeError('filePath must be a non-empty string')
    }
    if (!logger || typeof logger !== 'object') {
      throw new TypeError('logger must be an object')
    }

    this.retentionDays = nonNegativeNumber(retentionDays, 'retentionDays')
    this.maxEntries = positiveInteger(maxEntries, 'maxEntries')
    this.logger = logger

    const parent = path.dirname(path.resolve(filePath))
    fs.mkdirSync(parent, { recursive: true })
    this.db = new Database(filePath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('synchronous = NORMAL')
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        system TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_logs_ts ON logs(ts);
      CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
    `)

    this.insertStatement = this.db.prepare(`
      INSERT INTO logs (ts, level, message, system)
      VALUES (@ts, @level, @message, @system)
    `)
  }

  addEntry({ level = 'info', message, system = null, ts } = {}) {
    if (typeof level !== 'string' || level.length === 0) {
      throw new TypeError('level must be a non-empty string')
    }
    if (typeof message !== 'string') {
      throw new TypeError('message must be a string')
    }
    if (system !== null && typeof system !== 'string') {
      throw new TypeError('system must be a string or null')
    }

    const timestamp = ts === undefined ? Math.floor(Date.now() / 1000) : ts
    if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
      throw new TypeError('ts must be a non-negative safe integer')
    }

    const output = this.logger[level] ?? this.logger.log
    if (typeof output === 'function') {
      const prefix = system === null ? '' : `${system} | `
      output.call(this.logger, `${prefix}[${level.toUpperCase()}] ${message}`)
    }

    this.insertStatement.run({ level, message, system, ts: timestamp })
    this.prune()
  }

  prune(now = Math.floor(Date.now() / 1000)) {
    if (!Number.isSafeInteger(now) || now < 0) {
      throw new TypeError('now must be a non-negative safe integer')
    }

    const cutoff = now - this.retentionDays * 24 * 60 * 60
    this.db.prepare('DELETE FROM logs WHERE ts < ?').run(cutoff)
    this.db
      .prepare(
        `DELETE FROM logs WHERE id IN (
          SELECT id FROM logs
          ORDER BY ts DESC, id DESC
          LIMIT -1 OFFSET ?
        )`,
      )
      .run(this.maxEntries)
  }

  getRecent(limit = 100) {
    return this.db
      .prepare('SELECT * FROM logs ORDER BY ts DESC, id DESC LIMIT ?')
      .all(queryLimit(limit))
  }

  getAll() {
    return this.db.prepare('SELECT * FROM logs ORDER BY ts DESC, id DESC').all()
  }

  getByLevel(level, limit = 100) {
    if (typeof level !== 'string' || level.length === 0) {
      throw new TypeError('level must be a non-empty string')
    }
    return this.db
      .prepare(
        'SELECT * FROM logs WHERE level = ? ORDER BY ts DESC, id DESC LIMIT ?',
      )
      .all(level, queryLimit(limit))
  }

  log(message, system = null) {
    this.addEntry({ level: 'info', message, system })
  }

  info(message, system = null) {
    this.addEntry({ level: 'info', message, system })
  }

  warn(message, system = null) {
    this.addEntry({ level: 'warn', message, system })
  }

  error(message, system = null) {
    this.addEntry({ level: 'error', message, system })
  }

  createLogger(system = 'default') {
    return {
      log: (message) => this.log(message, system),
      info: (message) => this.info(message, system),
      warn: (message) => this.warn(message, system),
      error: (message) => this.error(message, system),
    }
  }

  close() {
    this.db.close()
  }
}
