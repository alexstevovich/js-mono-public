# @alexstevovich/list-git-tracked-files

List tracked files and untracked files not excluded by Git ignore rules.

```js
import listGitTrackedFiles from '@alexstevovich/list-git-tracked-files'

const files = await listGitTrackedFiles('./project')
```

The function invokes `git ls-files` directly and does not create a temporary
archive. Git must be available on `PATH`.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
