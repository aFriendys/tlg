import { createBrowserRouter } from 'react-router-dom'
import { StartView, UsersPrepare, UsersInProgress } from '../views'
import { Header } from '../widgets'

export const router = createBrowserRouter([
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
])
