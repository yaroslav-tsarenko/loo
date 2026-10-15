import { getContentStore } from '@/content/store'
import { getContent } from '@/server/content'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  await getContent()
  const store = getContentStore()
  const encoder = new TextEncoder()
  let cleanup = () => {}
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data))
        } catch {
          cleanup()
        }
      }
      send('retry: 2000\n\n')
      const unsubscribe = store.subscribe((event) => send(`event: content\ndata: ${JSON.stringify(event)}\n\n`))
      const heartbeat = setInterval(() => send(': ping\n\n'), 25_000)
      cleanup = () => {
        clearInterval(heartbeat)
        unsubscribe()
      }
      request.signal.addEventListener('abort', () => {
        cleanup()
        try {
          controller.close()
        } catch {}
      })
    },
    cancel() {
      cleanup()
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' },
  })
}
