import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { BASE_URL } from '../lib/constants'

interface Task {
  id: number
  name: string
}

interface ListData {
  listName: string
  tasks: Task[]
}

interface ErrorObject {
  message: string
}

const fetchList = async (): Promise<ListData | undefined> => {
  const userId = 2
  try {
    const response = await axios.post<ListData>(`${BASE_URL}/api/list`, {
      listId: 1,
      userId: userId,
    })
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useList = (): UseQueryResult<ListData, ErrorObject> => {
  console.log('USEQUERY')

  return useQuery('List', fetchList)
}

// export const createList = () => { return useMutation(
//   (newListName) =>
//     axios.post(`${BASE_URL}/api/list/${listId}`, {
//       name: newTaskName,
//     }),
//   {
//     onSuccess: (data, variables) => {

//       queryClient.setQueryData(['list', listId], (prevList: ListData | null) => ({
//         ...prevList!,
//         tasks: [...(prevList?.tasks || []), data],
//       }));
//     },
//     onError: (error) => {
//       console.error('Error adding task:', error);
//     },
//   }
// )}
