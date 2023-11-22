import { useState } from 'react'

import Signin from './Signin'
import Signup from './Signup'

function SigninSignup() {
  const [hasAccount, setHasAccount] = useState(false)

  return (
    <>
      {hasAccount ? <Signin /> : <Signup />}
      <p className="mt-10 text-center text-sm text-gray-500">
        {hasAccount ? 'Not a member? ' : 'Already a member? '}
        <button
          onClick={() => setHasAccount(!hasAccount)}
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {hasAccount ? 'Create account' : 'Sign in'}
        </button>
      </p>
    </>
  )
}

export default SigninSignup
