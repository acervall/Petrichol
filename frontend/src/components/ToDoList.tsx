import React, { useEffect, useState } from 'react'
import { useToDoList } from '../store/listStore'
import { useCreateTask } from '../store/taskStore'
import { useQueryClient } from 'react-query'
import { useLocalStorageId } from '../store/userStore'

const List: React.FC = () => {
  const queryClient = useQueryClient()
  const { isLoading: listLoading, error: listError, data: listData } = useToDoList()
  console.log('listData !!', listData)

  const storageUser = useLocalStorageId()
  const userId = storageUser.data

  const [listId, setListId] = useState(undefined)
  const addTaskMutation = useCreateTask()
  const [newTaskName, setNewTaskName] = useState('')

  useEffect(() => {
    if (listData) {
      setListId(listData.listId)
    }
  }, [listData])

  // Add task in To Do list

  if (listLoading) return 'Loading...'
  if (listError) return 'An error has occurred: ' + listError.message

  const addTask = async () => {
    if (listId && userId) {
      try {
        console.log('listId TRY', listId)
        console.log('newTaskName TRY', newTaskName)
        console.log('userId TRY', userId)

        await addTaskMutation.mutateAsync({ listId: listId, taskName: newTaskName, userId: userId })
        setNewTaskName('')
        queryClient.invalidateQueries('list')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  return (
    <div className="mx-auto max-w-md border border-gray-300 bg-lime-500 p-4">
      <h1>One List</h1>
      {listData && (
        <>
          <h1 className="text-m mb-4 font-bold">{listData.listName}</h1>
          <ul className="list-disc space-y-2">
            {listData.tasks.map((task) => (
              <li key={task.id} className="text-sm text-gray-700">
                {task.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Add task"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="mr-2 border border-gray-400 p-1 text-sm"
        />
        <button onClick={addTask} className="bg-blue-500 p-1 text-sm text-white">
          +
        </button>
      </div>
    </div>
  )
}

export default List
