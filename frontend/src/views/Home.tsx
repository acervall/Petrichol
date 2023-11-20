import { useState, useEffect } from 'react'
import SigninSignup from '../components/SigninSignup'
import List from '../components/List'
import Navbar from '../components/Navbar'
import { useLogoutUser, useUserData } from '../store/userStore'
import Folder from '../components/Folder'

function Home() {
  const { data: user, isLoading, isSuccess } = useUserData()
  const logoutUser = useLogoutUser()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    console.log('change login')
    // console.log('loggedIn', loggedIn)
    // console.log('user', user)
    console.log('isSuccess', isSuccess)

    if (isSuccess) {
      setLoggedIn(true)
    }
  }, [isSuccess])

  const handleLogout = async () => {
    await logoutUser.mutateAsync()
    setLoggedIn(false)
  }

  const handleClick = () => {
    console.log('loggedIn', loggedIn)
    console.log('user', user)
    console.log('isSuccess', isSuccess)
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {loggedIn ? (
        <>
          <div>Home</div>
          <button onClick={handleLogout}>Log out</button>
          <button onClick={handleClick}>KLICK</button>
          <Navbar />
          <Folder />
          <List />
        </>
      ) : (
        <SigninSignup onLogin={() => setLoggedIn(true)} />
      )}
    </>
  )
}

export default Home
