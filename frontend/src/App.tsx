import { useState, Suspense, useEffect } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import * as Preloads from './lib/preloads'
import './index.css'
import Context from './util/ Context'
import { Cookies } from './components/GDPR/Cookies'

function Root() {
  const [acceptCookies, setAcceptCookies] = useState(localStorage.getItem('Cookies'))
  const [userId, setUserId] = useState(
    acceptCookies ? localStorage.getItem('userId') : sessionStorage.getItem('userId'),
  )
  const [loggedStorage, setLoggedStorage] = useState(
    acceptCookies ? localStorage.getItem('loggedIn') : sessionStorage.getItem('loggedIn'),
  )

  useEffect(() => {
    acceptCookies ? setUserId(localStorage.getItem('userId')) : setUserId(sessionStorage.getItem('userId'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    acceptCookies
      ? setLoggedStorage(localStorage.getItem('loggedIn'))
      : setLoggedStorage(sessionStorage.getItem('loggedIn'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [loggedIn, setLoggedIn] = useState(loggedStorage)

  return (
    <Context.Provider value={{ loggedIn, setLoggedIn, acceptCookies, setAcceptCookies, userId, setUserId }}>
      <>
        <Navbar />
        <main>
          <Outlet />
          <Cookies />
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
