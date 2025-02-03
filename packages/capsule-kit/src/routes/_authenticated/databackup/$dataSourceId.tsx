import { createFileRoute } from '@tanstack/react-router'

export const DataSourceComponent = () => {
  return <></>
}

export const Route = createFileRoute(
  '/_authenticated/databackup/$dataSourceId',
)({
  component: () => <div>Hello /_authenticated/data/$dataSourceId!</div>,
})
