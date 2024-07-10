# Changelog

This file will keep track of significant changes that have happened in the
workshop material that is different from what you'll see in the videos.

## DataFunctionArgs

`DataFunctionArgs` was deprecated in Remix and will be removed in the future. It
is recommended to use `LoaderFunctionArgs` and `ActionFunctionArgs` instead
which are the exact same.

## `SpyInstance` -> `MockInstance`

Vitest renamed `SpyInstance` to `MockInstance` so the videos will use
`SpyInstance`, but you'll be using `MockInstance`:

```diff
- import { SpyInstance } from 'vitest'
+ import { MockInstance } from 'vitest'

...

- SpyInstance<Parameters<typeof console.error>>
+ MockInstance<typeof console.error>
```
