import { PageSkeleton } from '@/ui/design/Skeleton'

// Every route's instant response to a click (docs/PERFORMANCE.md): the shell stays, the page area shows its shape
// while the server renders it. Routes with a distinctive layout have their own loading.tsx.
export default function Loading() {
  return <PageSkeleton />
}
