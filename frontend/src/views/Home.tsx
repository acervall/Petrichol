import { useState, useEffect } from 'react'
import { useLogoutUser, useUserData } from '../store/userStore'
import SigninSignup from '../components/SigninSignup'
import HomeScreen from '../components/HomeScreen'

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
          <HomeScreen />
          <button onClick={handleLogout}>Log out</button>
          <button onClick={handleClick}>KLICK</button>
        </>
      ) : (
        <SigninSignup onLogin={() => setLoggedIn(true)} />
      )}
    </>
  )
}

export default Home
