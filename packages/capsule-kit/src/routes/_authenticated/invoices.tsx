import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/invoices')({
  component: () => <div>Hello /invoices!</div>,
})
