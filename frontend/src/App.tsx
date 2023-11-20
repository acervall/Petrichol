import { Suspense } from 'react'
// import { lazyWithPreload } from 'react-lazy-with-preload'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import * as Preloads from './lib/preloads'
import './index.css'

// const Home = lazyWithPreload(() => import('./views/Home')),
//   Lists = lazyWithPreload(() => import('./views/Lists')),
//   UserProfile = lazyWithPreload(() => import('./views/UserProfile')),
//   ListDetails = lazyWithPreload(() => import('./components/ListDetails'))

function Root() {
  return (
    <>
      <Navbar />
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
              <Preloads.Home />
            </Suspense>
          ),
          path: '/',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Preloads.UserProfile />
            </Suspense>
          ),
          path: '/profile',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Preloads.Lists />
            </Suspense>
          ),
          path: '/lists',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Preloads.ListDetails />
            </Suspense>
          ),
          path: '/lists/:listId',
        },
        {
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Preloads.FolderDetails />
            </Suspense>
          ),
          path: '/folder/:folderId',
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
import ListDetails from './components/ListDetails'
import Navbar from './components/Navbar'

import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'

// Define Root component
function Root() {
  return (
    <>
      <main>
        <Navbar />
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
        { element: <ListDetails />, path: '/lists/:listId' },
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
