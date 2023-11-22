// import { useQueryClient } from 'react-query'
import { useContext } from 'react'
import Context from '../util/ Context'
import SigninSignup from '../components/SigninSignup'
import HomeScreen from '../components/HomeScreen'

function Home() {
  const { loggedIn } = useContext(Context)

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }
  console.log('loggedIn', loggedIn)

  return (
    <>
      {loggedIn ? (
        <>
          <HomeScreen />
        </>
      ) : (
        <>
          <SigninSignup />
        </>
      )}
    </>
  )
}

export default Home
