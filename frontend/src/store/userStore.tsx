import { useMutation, UseMutationResult, MutationFunction } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

interface ErrorObject {
  message: string
}

interface User {
  id: number
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

// LOGIN
const loginUser: MutationFunction<User, { identifier: string; password: string }> = async ({ identifier, password }) => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/api/user/login`, {
      identifier,
      password,
    })
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw new Error('Error logging in')
  }
}

export const useLoginUser = (): UseMutationResult<User, ErrorObject, { identifier: string; password: string }> => {
  return useMutation<User, ErrorObject, { identifier: string; password: string }>(loginUser, {
    onSuccess: (data) => {
      console.log('Login successful:', data)
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
    onSettled: (data, error) => {
      console.log('Mutation completed:', { data, error })
    },
  })
}

// SIGNUP
export const useSignupUser = (): UseMutationResult<void, ErrorObject, User> => {
  const signupUser = async ({ username, email, password, first_name, last_name }: User): Promise<void> => {
    try {
      await axios.post<void>(`${BASE_URL}/api/user/signup`, {
        username,
        email,
        password,
        first_name,
        last_name,
      })
    } catch (error) {
      console.error('Error signing up:', error)
      throw new Error('Error signing up')
    }
  }

  return useMutation(signupUser)
}

// EDIT USER
export const useEditUser = (): UseMutationResult<
  void,
  ErrorObject,
  {
    id: number
    user: User
  }
> => {
  const editUserMutation = async ({ id, user }: { id: number; user: User }): Promise<void> => {
    try {
      await axios.put<void>(`${BASE_URL}/api/user`, user, {
        params: {
          id,
        },
      })
    } catch (error) {
      console.error('Error editing user:', error)
      throw new Error('Error editing user')
    }
  }

  return useMutation(editUserMutation)
}

// DELETE USER
export const useDeleteUser = (): UseMutationResult<void, ErrorObject, number> => {
  const deleteUserMutation = async (id: number): Promise<void> => {
    try {
      await axios.delete<void>(`${BASE_URL}/api/user`, {
        data: {
          id,
        },
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Error deleting user')
    }
  }

  return useMutation(deleteUserMutation)
}
