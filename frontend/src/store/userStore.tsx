import {
  useMutation,
  UseMutationResult,
  MutationFunction,
  useQuery,
  useQueryClient,
  QueryObserverResult,
} from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

interface ErrorObject {
  message: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  user: T
}

interface User {
  id?: number
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

type UseQueryResult<TData, TError> = QueryObserverResult<TData, TError>

// LOGIN

const fetchUserData = async (identifier: string, password: string): Promise<User | undefined> => {
  try {
    const response = await axios.post<ApiResponse<User>>(`${BASE_URL}/api/user/login`, {
      identifier,
      password,
    })

    console.log('User data:', response.data.user)
    return response.data.user || undefined // Kontrollera om användaren är undefinied och returnera i så fall.
  } catch (error) {
    console.error('Error logging in:', error)
    throw new Error('Error logging in')
  }
}

export const useLoginUser = (): UseMutationResult<
  User | undefined,
  ErrorObject,
  { identifier: string; password: string }
> => {
  const queryClient = useQueryClient()

  const loginUser: MutationFunction<User | undefined, { identifier: string; password: string }> = async ({
    identifier,
    password,
  }) => {
    try {
      const user = await fetchUserData(identifier, password)

      // Uppdatera cachen med användarinformationen
      const userKey = ['user', user?.id]
      queryClient.setQueryData(userKey, user)

      return user
    } catch (error) {
      console.error('Error logging in:', error)
      throw new Error('Error logging in')
    }
  }

  return useMutation<User | undefined, ErrorObject, { identifier: string; password: string }>(loginUser, {
    onSuccess: (data) => {
      console.log('Login successful:', data)
      if (data) {
        queryClient.setQueryData('user', data)
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
    onSettled: (data, error) => {
      console.log('Mutation completed:', { data, error })
    },
  })
}

export const useUserData = (): UseQueryResult<User | undefined, ErrorObject> => {
  return useQuery<User | undefined, ErrorObject>('userData', ({ queryKey }) =>
    fetchUserData(queryKey[1] as string, queryKey[2] as string),
  )
}

// LOGOUT

export const useLogoutUser = (): UseMutationResult<void, ErrorObject, void> => {
  const queryClient = useQueryClient()

  const logoutUser = async () => {
    queryClient.removeQueries('user')
  }

  return useMutation<void, ErrorObject, void>(logoutUser, {
    onSuccess: () => {
      console.log('Logout successful')
    },
    onError: (error) => {
      console.error('Logout error:', error)
    },
    onSettled: (data, error) => {
      console.log('Logout completed:', { data, error })
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
