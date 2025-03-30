import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/loginOld')({
  component: () => <div>Hello /loginOld!</div>,
})
