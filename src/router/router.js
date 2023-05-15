import { createBrowserRouter } from 'react-router-dom'
import { StartView, AuthView, UsersPrepare, UsersInProgress } from '../views'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartView />
  },
  {
    path: 'auth',
    element: <AuthView />
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
