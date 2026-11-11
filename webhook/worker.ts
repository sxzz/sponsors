// Relays GitHub Sponsors / Afdian webhooks to a `repository_dispatch` event,
// since sponsorship changes can't trigger GitHub Actions directly.

interface Env {
  /** Fine-grained PAT for sxzz/sponsors with "Contents: read and write" */
  DISPATCH_TOKEN: string
  /** Secret configured on the GitHub Sponsors webhook */
  GITHUB_WEBHOOK_SECRET: string
  /** Random string used as the Afdian webhook path, since Afdian doesn't sign requests */
  AFDIAN_PATH_TOKEN: string
}

const REPO = 'sxzz/sponsors'
const EVENT_TYPE = 'sponsors-update'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST')
      return new Response('Method Not Allowed', { status: 405 })

    const { pathname } = new URL(request.url)

    if (pathname === '/github') {
      const body = await request.text()
      const valid = await verifyGitHubSignature(
        body,
        request.headers.get('x-hub-signature-256'),
        env.GITHUB_WEBHOOK_SECRET,
      )
      if (!valid) return new Response('Invalid signature', { status: 401 })

      const event = request.headers.get('x-github-event')
      if (event !== 'sponsorship') return new Response(`Ignored: ${event}`)

      const { action } = JSON.parse(body)
      return dispatch(env, { source: 'github', action })
    }

    if (env.AFDIAN_PATH_TOKEN && pathname === `/afdian/${env.AFDIAN_PATH_TOKEN}`) {
      const res = await dispatch(env, { source: 'afdian' })
      // Afdian requires `ec: 200`, otherwise it rejects the URL / keeps retrying
      return Response.json(
        res.ok ? { ec: 200, em: '' } : { ec: 500, em: 'dispatch failed' },
      )
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function dispatch(
  env: Env,
  payload: Record<string, unknown>,
): Promise<Response> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.DISPATCH_TOKEN}`,
      'User-Agent': 'sponsors-webhook',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: EVENT_TYPE, client_payload: payload }),
  })
  if (!res.ok) {
    console.error('Dispatch failed', res.status, await res.text())
    return new Response('Dispatch failed', { status: 502 })
  }
  return new Response('Dispatched')
}

async function verifyGitHubSignature(
  body: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature?.startsWith('sha256=') || !secret) return false
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const sig = hexToBytes(signature.slice('sha256='.length))
  if (!sig) return false
  return crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(body))
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> | undefined {
  if (hex.length % 2 || /[^\da-f]/i.test(hex)) return
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}
