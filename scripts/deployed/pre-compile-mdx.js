import path from 'node:path'
import { getApps } from '@kentcdodds/workshop-app/apps.server'
import { compileMdx } from '@kentcdodds/workshop-app/compile-mdx.server'
import { getWatcher } from '@kentcdodds/workshop-app/change-tracker'

console.log('pre-compiling mdx files...')
console.time('compilation finished')
if (!process.env.KCDSHOP_CONTEXT_CWD) {
	throw new Error('process.env.KCDSHOP_CONTEXT_CWD is not defined')
}
const readmeFilepath = path.join(
	process.env.KCDSHOP_CONTEXT_CWD,
	'exercises',
	'README.mdx',
)
await compileMdx(readmeFilepath).catch(e => {
	console.error(`there was an error processing ${readmeFilepath}`, e)
})
await getApps()
console.timeEnd('compilation finished')

getWatcher().close()
