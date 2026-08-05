import { env } from '../config/env.js'

const deployTimeoutMs = 10000

async function triggerRenderDeploy(url, target) {
  if (!url) {
    return { status: 'not_configured', triggered: false, target }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), deployTimeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Render deploy hook returned ${response.status}`)
    }

    return { status: 'accepted', triggered: true, target }
  } finally {
    clearTimeout(timeout)
  }
}

export function triggerFrontendDeploy() {
  return triggerRenderDeploy(env.renderFrontendDeployHookUrl, 'frontend')
}

export function triggerCmsDeploy() {
  return triggerRenderDeploy(env.renderCmsDeployHookUrl, 'cms')
}
