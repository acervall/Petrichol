import { useMutation, UseMutationResult } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

interface ErrorObject {
  message: string
}

interface Task {
  id: number
  name: string
  user_id: number
}

// GET ALL TASKS
export const useGetTasks = (): UseMutationResult<Task[], ErrorObject, void> => {
  const getTasks = async (): Promise<Task[]> => {
    try {
      const response = await axios.get<Task[]>(`${BASE_URL}/api/task`)
      return response.data
    } catch (error) {
      console.error('Error getting tasks:', error)
      throw new Error('Error getting tasks')
    }
  }

  return useMutation(getTasks)
}

// GET TASK BY ID
export const useGetTask = (): UseMutationResult<Task, ErrorObject, number> => {
  const getTask = async (id: number): Promise<Task> => {
    try {
      const response = await axios.get<Task>(`${BASE_URL}/api/task/${id}`)
      return response.data
    } catch (error) {
      console.error('Error getting task:', error)
      throw new Error('Error getting task')
    }
  }

  return useMutation(getTask)
}

// CREATE TASK
export const useCreateTask = (): UseMutationResult<void, ErrorObject, Task> => {
  const createTask = async ({ name, user_id }: Task): Promise<void> => {
    try {
      await axios.post<void>(`${BASE_URL}/api/task`, {
        name,
        user_id,
      })
    } catch (error) {
      console.error('Error creating task:', error)
      throw new Error('Error creating task')
    }
  }

  return useMutation(createTask)
}

// DELETE TASK
export const useDeleteTask = (): UseMutationResult<
  void,
  ErrorObject,
  number
> => {
  const deleteTask = async (id: number): Promise<void> => {
    try {
      await axios.delete<void>(`${BASE_URL}/api/task/${id}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error('Error deleting task')
    }
  }

  return useMutation(deleteTask)
}
// POST A NEW TASK
export const usePostTask = (): UseMutationResult<Task, ErrorObject, Task> => {
  const postTask = async ({ name, user_id }: Task): Promise<Task> => {
    try {
      const response = await axios.post<Task>(`${BASE_URL}/api/task`, {
        name,
        user_id,
      })
      return response.data
    } catch (error) {
      console.error('Error posting task:', error)
      throw new Error('Error posting task')
    }
  }

  return useMutation(postTask)
}

// UPDATE A TASK
export const useUpdateTask = (): UseMutationResult<
  Task,
  ErrorObject,
  { id: number; task: Task }
> => {
  const updateTask = async ({
    id,
    task,
  }: {
    id: number
    task: Task
  }): Promise<Task> => {
    try {
      const response = await axios.put<Task>(`${BASE_URL}/api/task/${id}`, task)
      return response.data
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error('Error updating task')
    }
  }

  return useMutation(updateTask)
}
