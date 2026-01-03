import { PATH_ROUTES } from '@/constants/path-route'
import { RouteObject } from 'react-router-dom'

export type PathRoute = (typeof PATH_ROUTES)[keyof typeof PATH_ROUTES]

export type RouteObjectType = RouteObject & {
  path: PathRoute
  element: React.ReactElement
  hasLayout?: boolean
  children?: RouteObjectType[]
  roles?: string[]
}
