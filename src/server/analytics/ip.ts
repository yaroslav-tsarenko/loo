import { createHmac } from 'node:crypto'

// Visitors' IPs are never stored (docs/ANALYTICS.md): the network (IPv4 /24, IPv6 /48) is HMAC'd with a server
// secret into a short token. Same network → same token, so «unique visitors by network» and abuse spotting still work;
// the address itself can't be recovered from the database (or a leaked copy of it).

export const IP_TOKEN_PREFIX = 'h:'

export function ipSecret(env: Record<string, string | undefined> = process.env): string {
  return env.ANALYTICS_IP_SALT || env.CRON_SECRET || env.DATABASE_URL || 'levelup-dev-ip-salt'
}

export function ipNetwork(ip: string): string | null {
  const v = ip.trim().toLowerCase()
  const v4 = /^(?:::ffff:)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/.exec(v)
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0/24`
  if (v.includes(':')) {
    // expand :: and keep the first three groups (/48)
    const [head = '', tail = ''] = v.split('::')
    const h = head ? head.split(':') : []
    const t = tail ? tail.split(':') : []
    const groups = v.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h
    if (groups.length < 3 || groups.some((g) => !/^[0-9a-f]{0,4}$/.test(g))) return null
    return `${groups.slice(0, 3).map((g) => g.replace(/^0+(?=.)/, '') || '0').join(':')}::/48`
  }
  return null
}

export function anonymizeIp(ip: string | null, secret: string = ipSecret()): string | null {
  if (!ip) return null
  if (ip.startsWith(IP_TOKEN_PREFIX)) return ip
  const network = ipNetwork(ip)
  if (!network) return null
  return IP_TOKEN_PREFIX + createHmac('sha256', secret).update('levelup.analytics-ip.v1\u0000').update(network).digest('base64url').slice(0, 12)
}
