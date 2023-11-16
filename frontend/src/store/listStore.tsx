import { useQuery, UseQueryResult, useMutation } from 'react-query'
import axios from 'axios'

//For running local with npm run dev:
const url = 'http://localhost:3000'

//For running in docker compose enviroment:
// const url = '/api'

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

const fetchTodoList = async (): Promise<ListData | undefined> => {
  try {
    const response = await axios.get<ListData>(`${url}/list/1`)
    console.log('response.data', response.data)
    console.log('slkjdksjkdsj')
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useTodoList = (): UseQueryResult<ListData, ErrorObject> => {
  console.log('USEQUERY')

  return useQuery('todoList', fetchTodoList)
}

// export const createList = () => { return useMutation(
//   (newListName) =>
//     axios.post(`${url}/api/list/${listId}`, {
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
