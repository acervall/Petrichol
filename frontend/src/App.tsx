import Home from './views/Home'
import UserProfile from './views/UserProfile'
import Lists from './views/Lists'

import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'

function Root() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: '/' },
        { element: <UserProfile />, path: '/profile' },
        { element: <Lists />, path: '/lists' },
      ],
      element: <Root />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
