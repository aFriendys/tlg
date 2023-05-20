import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { StartView, UsersPrepare, UsersInProgress } from 'views'
import { Header } from 'widgets'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <StartView />
  },
  {
    path: 'prepare',
    element: (
      <>
        <Header />
        <UsersPrepare />
      </>
    )
  },
  {
    path: 'inProgress',
    element: <UsersInProgress />
  }
]

export const router = createBrowserRouter(routes)
