#!/usr/bin/env node

import { $ } from 'execa'
import { writeFile } from 'node:fs/promises'

function logError(message, error) {
	const errorMessage =
		error && error.message
			? error.message
			: 'No additional information available'
	console.error(`${message}: ${errorMessage}`)
}

async function setupSwapfile() {
	console.log('setting up swapfile...')

	try {
		await $`fallocate -l 512M /swapfile`
		await $`chmod 0600 /swapfile`
		await $`mkswap /swapfile`
	} catch (error) {
		return logError('Error while setting up swapfile', error)
	}

	try {
		await writeFile('/proc/sys/vm/swappiness', '10')
		await $`swapon /swapfile`
		await writeFile('/proc/sys/vm/overcommit_memory', '1')
	} catch (error) {
		return logError('Error while configuring system settings', error)
	}

	console.log('swapfile setup completed successfully')
}

await setupSwapfile()
