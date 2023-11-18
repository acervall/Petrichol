import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'
import { Task, ErrorObject } from './taskStore'

export interface List {
  listName: string
  tasks: Task[]
}

const fetchList = async (
  listId: number,
  userId: number,
): Promise<List | undefined> => {
  try {
    const response = await axios.post<List>(`${BASE_URL}/api/list`, {
      listId: listId,
      userId: userId,
    })
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useList = (
  listId: number,
  userId: number,
): UseQueryResult<List, ErrorObject> => {
  console.log('USEQUERY')

  return useQuery('list', () => fetchList(listId, userId))
}
