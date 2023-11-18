import React, { useState } from 'react'
import { useList } from '../store/listStore'
import { useCreateTask } from '../store/taskStore'
import { useQueryClient } from 'react-query'

const List: React.FC = () => {
  const queryClient = useQueryClient()
  const {
    isLoading: listLoading,
    error: listError,
    data: listData,
  } = useList(1, 2)

  const addTaskMutation = useCreateTask()
  const [newTaskName, setNewTaskName] = useState('')


  if (listLoading) return 'Loading...'
  if (listError) return 'An error has occurred: ' + listError.message

  const addTask = async () => {
    try {
      await addTaskMutation.mutateAsync({ listId: 1, taskName: newTaskName })
      setNewTaskName('')
      queryClient.invalidateQueries('list')
    } catch (error) {
      console.error('Error creating folder:', error)
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
        <button
          onClick={addTask}
          className="bg-blue-500 p-1 text-sm text-white"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default List
