import { createBrowserRouter } from 'react-router-dom'
import { StartView, UsersPrepare, UsersInProgress } from '../views'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartView />
  },
  {
    path: 'prepare',
    element: <UsersPrepare />
  },
  {
    path: 'inProgress',
    element: <UsersInProgress />
  }
])
