// import { useQueryClient } from 'react-query'
import { useContext } from 'react'
import Context from '../util/ Context'
import SigninSignup from '../components/SigninSignup'
import HomeScreen from '../components/HomeScreen'

function Home() {
  const { loggedIn, setLoggedIn } = useContext(Context)

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }

  return (
    <>
      {loggedIn ? (
        <>
          <HomeScreen />
        </>
      ) : (
        <SigninSignup onLogin={() => setLoggedIn(true)} />
      )}
    </>
  )
}

export default Home
