import { useMutation, useQueryClient, UseQueryResult, useQuery } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import Context from '../util/ Context'

interface ApiResponse<T> {
  success: boolean
  message: string
  user: T
}

export interface User {
  id?: number
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface UserProps {
  acceptCookies: boolean
  setUserId: React.Dispatch<React.SetStateAction<number>>
  loggedIn: boolean
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
}

export const useLocalStorageId = (): UseQueryResult<User['id']> => {
  const { acceptCookies, setUserId } = useContext<UserProps>(Context)
  const userIdString = acceptCookies ? localStorage.getItem('userId') : sessionStorage.getItem('userId')
  const userId = userIdString !== null ? JSON.parse(userIdString) : null
  setUserId(userId)
  return useQuery('userId', () => userId)
}

const useUserActions = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setLoggedIn, acceptCookies, userId, setUserId } = useContext<UserProps>(Context)

  const getUser = async (id: number): Promise<User> => {
    try {
      const response = await axios.post<ApiResponse<User>>(`${BASE_URL}/api/user/info`, {
        id,
      })

      const user = response.data.user

      return user
    } catch (error) {
      console.error('No user found', error)
      throw new Error('error finding user')
    }
  }

  // LOGIN

  const loginUser = async ({ identifier, password }: { identifier: string; password: string }): Promise<User> => {
    try {
      const response = await axios.post<ApiResponse<User>>(`${BASE_URL}/api/user/login`, {
        identifier,
        password,
      })

      const user = response.data.user

      if (response.data.success) {
        queryClient.setQueryData('user', user)
        acceptCookies
          ? localStorage.setItem('userId', JSON.stringify(user.id))
          : sessionStorage.setItem('userId', JSON.stringify(user.id))

        acceptCookies
          ? localStorage.setItem('loggedIn', JSON.stringify(true))
          : sessionStorage.setItem('loggedIn', JSON.stringify(true))

        setLoggedIn(true)
        if (user.id) {
          setUserId(user.id)
        }
      }

      return user
    } catch (error) {
      console.error('Error logging in:', error)
      throw new Error('Error logging in')
    }
  }

  // LOGOUT
  const logoutUser = async (): Promise<void> => {
    queryClient.removeQueries('user')
    localStorage.clear()
    sessionStorage.clear()
    setLoggedIn(false)
    navigate(`/`)
  }

  // SIGNUP

  const signupUser = async ({ username, email, password, first_name, last_name }: User): Promise<void> => {
    try {
      await axios.post<ApiResponse<User>>(`${BASE_URL}/api/user/signup`, {
        username,
        email,
        password,
        first_name,
        last_name,
      })

      await loginUser({ identifier: username, password })
    } catch (error) {
      console.error('Error signing up:', error)
      throw new Error('Error signing up')
    }
  }

  //EDIT USER
  const editUser = async ({ id, username, email, password, first_name, last_name }: User): Promise<void> => {
    try {
      const response = await axios.put<ApiResponse<User>>(`${BASE_URL}/api/user/edit`, {
        id,
        username,
        email,
        password,
        first_name,
        last_name,
      })
      const newUserInfo = response.data.user
      console.log(newUserInfo)
    } catch (error) {
      console.error('Error editing user:', error)
      throw new Error('Error editing user')
    }
  }

  //DELETE USER
  const deleteUser = async (): Promise<void> => {
    try {
      await axios.delete<void>(`${BASE_URL}/api/user`, {
        data: { userId },
      })
      logoutUser()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Error deleting user')
    }
  }

  return {
    getUser: useMutation(getUser),
    loginUser: useMutation(loginUser),
    logoutUser: useMutation(logoutUser),
    signupUser: useMutation(signupUser),
    editUser: useMutation(editUser),
    deleteUser: useMutation(deleteUser),
  }
}

export default useUserActions
