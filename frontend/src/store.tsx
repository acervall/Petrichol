import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'

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

const fetchTodoList = async (): Promise<ListData> => {
  const response = await axios.get<ListData>('/api/list')
  console.log('response.data', response.data)

  return response.data
}

export const useTodoList = (): UseQueryResult<ListData, ErrorObject> => {
  console.log('USEQUERY')

  return useQuery('todoList', fetchTodoList)
}

// export const useTodoList = () =>
//   useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })

// const {
//   data: listData,
//   error,
//   isLoading,
// } = useQuery<ListData>('listData', fetchList)

// // Handle loading and error states
// if (isLoading) {
//   return <div>Loading...</div>
// }

// if (error) {
//   return <div>Error fetching data: {error.message}</div>
// }
