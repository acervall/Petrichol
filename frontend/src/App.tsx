import { useState, Suspense } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import * as Preloads from './lib/preloads'
import './index.css'
import Context from './util/ Context'

function Root() {
  const [acceptCookies, setAcceptCookies] = useState(false)

  const userId = acceptCookies ? localStorage.getItem('userId') : sessionStorage.getItem('userId')

  const [loggedIn, setLoggedIn] = useState(userId !== null)
  return (
    <Context.Provider value={{ loggedIn, setLoggedIn, acceptCookies, setAcceptCookies }}>
      <>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </>
    </Context.Provider>
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
