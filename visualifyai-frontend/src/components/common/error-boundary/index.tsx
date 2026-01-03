import { useRouteError } from 'react-router-dom'
import { Alert } from 'antd'

export const ErrorBoundary = () => {
  const error = useRouteError() as Error

  return <Alert.ErrorBoundary message={error.message} />
}
