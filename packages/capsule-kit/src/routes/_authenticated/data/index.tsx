import { createFileRoute } from '@tanstack/react-router'
import { DataSourceDashboard } from '@/components/data-sources/DataSourceDashboard.tsx'

export const Route = createFileRoute('/_authenticated/data/')({
  component: () => <DataSourceDashboard />,
})
