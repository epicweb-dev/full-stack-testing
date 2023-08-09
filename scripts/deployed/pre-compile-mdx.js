import { getApps } from '@kentcdodds/workshop-app/apps.server'
import { getWatcher } from '@kentcdodds/workshop-app/change-tracker'

console.log('pre-compiling mdx files...')
console.time('compilation finished')
await getApps()
console.timeEnd('compilation finished')

getWatcher().close()
