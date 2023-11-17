import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./views/Home'))
const UserProfile = lazy(() => import('./views/UserProfile'))
const Lists = lazy(() => import('./views/Lists'))
const ListDetail = lazy(() => import('./components/ListDetails'))

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
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          ),
          path: '/',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <UserProfile />
            </Suspense>
          ),
          path: '/profile',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Lists />
            </Suspense>
          ),
          path: '/lists',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ListDetail />
            </Suspense>
          ),
          path: '/lists/:listId',
        },
      ],
      element: <Root />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App

/*import Home from './views/Home'
import UserProfile from './views/UserProfile'
import Lists from './views/Lists'
import ListDetail from './components/ListDetails'

import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'

// Define Root component
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
        { element: <ListDetail />, path: '/lists/:listId' },
      ],
      element: <Root />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App*/

/*import Home from './views/Home'
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
*/
