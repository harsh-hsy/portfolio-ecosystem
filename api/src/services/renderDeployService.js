import { env } from '../config/env.js'

const deployTimeoutMs = 10000

export async function triggerFrontendDeploy() {
  if (!env.renderFrontendDeployHookUrl) {
    return { status: 'not_configured', triggered: false }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), deployTimeoutMs)

  try {
    const response = await fetch(env.renderFrontendDeployHookUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Render deploy hook returned ${response.status}`)
    }

    return { status: 'accepted', triggered: true }
  } finally {
    clearTimeout(timeout)
  }
}
