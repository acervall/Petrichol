import { useState } from 'react'
import SigninSignup from '../components/SigninSignup'
import List from '../components/List'


function Home() {
  const [loggedIn, setLoggedIn] = useState(true)
  // TODO: add login status, context?

  if (loggedIn) {
    return (
      <>
        <div>Home</div>
        <button onClick={() => setLoggedIn(false)}>
          Set logged in to false
        </button>
        <List />
      </>
    )
  } else {
    return (
      <>
        <SigninSignup />
        <button onClick={() => setLoggedIn(true)}>Set logged in to true</button>
      </>
    )
  }
}

export default Home
