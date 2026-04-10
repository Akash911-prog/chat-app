import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/chat/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/chat/$id"!</div>
}
