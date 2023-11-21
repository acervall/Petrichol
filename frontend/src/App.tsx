import { useEffect, useState, Suspense, createContext } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import * as Preloads from './lib/preloads'
import './index.css'
import { useLocalStorageId } from './store/userStore'

function Root() {
  const AuthContext = createContext({})
  const [loggedIn, setLoggedIn] = useState(false)
  const { data } = useLocalStorageId()

  useEffect(() => {
    if (data) {
      setLoggedIn(true)
    } else if (data === undefined) {
      setLoggedIn(false)
    }
  }, [data])

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {loggedIn ? (
        <>
          <Navbar />
          <main>
            <Outlet />
          </main>
        </>
      ) : (
        <>
          <main>
            <Preloads.SigninSignup onLogin={() => setLoggedIn(true)} />
          </main>
        </>
      )}
    </AuthContext.Provider>
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
