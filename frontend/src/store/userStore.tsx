import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

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

const useUserActions = () => {
  const queryClient = useQueryClient()

  // LOGIN

  const loginUser = async ({ identifier, password }: { identifier: string; password: string }): Promise<User> => {
    try {
      const response = await axios.post<ApiResponse<User>>(`${BASE_URL}/api/user/login`, {
        identifier,
        password,
      })

      const user = response.data.user
      const userKey = ['user', user?.id]

      queryClient.setQueryData(userKey, user)
      queryClient.setQueryData('user', user)

      return user
    } catch (error) {
      console.error('Error logging in:', error)
      throw new Error('Error logging in')
    }
  }

  // LOGOUT
  const logoutUser = async (): Promise<void> => {
    queryClient.removeQueries('user')
  }

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

  //EDIT USER
  const editUser = async ({ id, user }: { id: number; user: User }): Promise<void> => {
    try {
      await axios.put<void>(`${BASE_URL}/api/user`, user, {
        params: { id },
      })
    } catch (error) {
      console.error('Error editing user:', error)
      throw new Error('Error editing user')
    }
  }

  //DELETE USER
  const deleteUser = async (id: number): Promise<void> => {
    try {
      await axios.delete<void>(`${BASE_URL}/api/user`, {
        data: { id },
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Error deleting user')
    }
  }

  return {
    loginUser: useMutation(loginUser),
    logoutUser: useMutation(logoutUser),
    signupUser: useMutation(signupUser),
    editUser: useMutation(editUser),
    deleteUser: useMutation(deleteUser),
  }
}

export default useUserActions
