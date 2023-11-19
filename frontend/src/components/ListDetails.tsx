import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const ListDetails: React.FC = () => {
  const { listId } = useParams()
  const navigate = useNavigate()
  const [listData, setListData] = useState<ListData | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editedTaskName, setEditedTaskName] = useState<string>('')
  const [isEditingMode, setIsEditingMode] = useState(false)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get<ListData>(
          `${BASE_URL}/api/list/${listId}`,
        )
        setListData(response.data)
        setEditingTaskId(null)
        setIsEditingMode(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchList()
  }, [listId])

  const AddTask = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/list/${listId}/tasks`,
        {
          name: newTaskName,
        },
      )
      setListData((prevList) => ({
        ...prevList!,
        tasks: [...(prevList?.tasks || []), response.data],
      }))

      setNewTaskName('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const DeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/list/${listId}/tasks/${taskId}`)
      setListData((prevList) => ({
        ...prevList!,
        tasks: prevList?.tasks.filter((task) => task.id !== taskId) || [],
      }))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const EditTask = (taskId: number) => {
    const taskToEdit = listData?.tasks.find((task) => task.id === taskId)
    if (taskToEdit) {
      setEditingTaskId(taskId)
      setEditedTaskName(taskToEdit.name)
      setIsEditingMode(true)
    }
  }

  const SaveEdit = async (taskId: number) => {
    if (!editedTaskName.trim()) {
      return
    }

    try {
      await axios.put(`${BASE_URL}/api/list/${listId}/tasks/${taskId}`, {
        name: editedTaskName,
      })

      setListData((prevList) => ({
        ...prevList!,
        tasks:
          prevList?.tasks.map((task) =>
            task.id === taskId ? { ...task, name: editedTaskName } : task,
          ) || [],
      }))

      setEditingTaskId(null)
      setEditedTaskName('')
      setIsEditingMode(false)
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  const CancelEdit = () => {
    setEditingTaskId(null)
    setEditedTaskName('')
    setIsEditingMode(false)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (!listData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="mx-auto max-w-md border border-gray-300 bg-blue-100 p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-m font-bold">{listData?.listName}</h1>
          {listData && listData.tasks.length === 0 && (
            <div className="mt-2 text-sm text-red-600">
              Your list is empty, add tasks
            </div>
          )}
          <button
            onClick={handleGoBack}
            className="cursor-pointer text-sm text-blue-500"
          >
            Go Back
          </button>
        </div>

        {listData.tasks.length > 0 ? (
          <ul className="list-disc space-y-2">
            {listData.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center text-sm text-gray-700"
              >
                {isEditingMode && editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                      className="mr-2 border border-gray-400 p-1 text-sm"
                    />
                    <button
                      onClick={() => SaveEdit(task.id)}
                      className="pr-2 text-sm text-green-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => CancelEdit()}
                      className="pl-2 text-sm text-red-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="mr-2">{task.name}</span>
                    {task.name && (
                      <>
                        <button
                          onClick={() => DeleteTask(task.id)}
                          className="text-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => EditTask(task.id)}
                          className="ml-2 text-blue-500"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div>Your list is empty, add tasks</div>
        )}

        {!isEditingMode && listData.tasks.length > 0 && (
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Add task"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="mr-2 border border-gray-400 p-1 text-sm"
            />
            <button
              onClick={AddTask}
              className="bg-blue-500 p-1 text-sm text-white"
            >
              +
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default ListDetails
