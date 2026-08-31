# @alexstevovich/acidlog

Persist bounded application logs in a local SQLite database.

```js
import AcidLog from '@alexstevovich/acidlog'

const log = new AcidLog('./var/application.db', {
  retentionDays: 7,
  maxEntries: 5000,
})

log.info('Started', 'server')
const recent = log.getRecent(100)
log.close()
```

The class provides `log`, `info`, `warn`, `error`, `addEntry`, `getRecent`,
`getAll`, `getByLevel`, `prune`, `createLogger`, and `close`. Timestamps are
non-negative Unix seconds. Entries are pruned after every insertion according
to both retention age and maximum count.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2017 Alex Stevovich.
