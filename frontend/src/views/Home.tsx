import { useState } from 'react'
// import { useQueryClient } from 'react-query'
import SigninSignup from '../components/SigninSignup'
import HomeScreen from '../components/HomeScreen'

function Home() {
  // const { data: user, isLoading, isSuccess } = useUserData()
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogout = async () => {
    setLoggedIn(false)
  }

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }

  return (
    <>
      {loggedIn ? (
        <>
          <HomeScreen />
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <SigninSignup onLogin={() => setLoggedIn(true)} />
      )}
    </>
  )
}

export default Home
