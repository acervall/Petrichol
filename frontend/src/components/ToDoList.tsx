import React, { useEffect, useState } from 'react'
import { useToDoList } from '../store/listStore'
import { useCreateTask } from '../store/taskStore'
import { useQueryClient } from 'react-query'
import { useLocalStorageId } from '../store/userStore'

const List: React.FC = () => {
  const queryClient = useQueryClient()
  const { isLoading: listLoading, error: listError, data: listData } = useToDoList()

  const storageUser = useLocalStorageId()
  const userId = storageUser.data

  const [listId, setListId] = useState(undefined)
  const addTaskMutation = useCreateTask()
  const [newTaskName, setNewTaskName] = useState('')

  useEffect(() => {
    if (listData !== undefined) {
      setListId(listData.listId)
    }
  }, [listData, listId])

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
    <div className="m-10 mx-auto mt-10 max-w-lg p-2">
      {listData && (
        <>
          <h1 className="text-m  pb-2 pl-3 font-bold">{listData.listName}</h1>
          <ul className="mt-4 space-y-4">
            {listData.tasks.map((task) => (
              <li
                key={task.id}
                className="text-md flex items-center justify-between rounded-md bg-stone-300 p-2 text-xs shadow-md hover:bg-stone-400"
              >
                {task.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-4 flex items-center pb-10 pl-5 pr-5 text-xs">
        <input
          type="text"
          placeholder="Add task"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="mr-2 flex-grow rounded-md border border-gray-300 p-1 text-xs"
        />
        <button onClick={addTask} className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white">
          +
        </button>
      </div>
    </div>
  )
}

export default List
