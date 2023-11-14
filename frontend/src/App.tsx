import Home from './views/Home'
import UserProfile from './views/UserProfile'
import Lists from './views/Lists'

import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

function Root() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/lists">Lists</Link>
          </li>
        </ul>
      </nav>
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
