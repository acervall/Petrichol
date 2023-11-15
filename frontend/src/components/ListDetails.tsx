import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Task {
  id: number
  name: string
}

interface ListData {
  listName: string
  tasks: Task[]
}

const ListDetail: React.FC = () => {
  const { listId } = useParams()
  const navigate = useNavigate()
  const [listData, setListData] = useState<ListData | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editedTaskName, setEditedTaskName] = useState<string>('')

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get<ListData>(`/api/list/${listId}`)
        setListData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchList()
  }, [listId])

  const AddTask = async () => {
    try {
      const response = await axios.post(`/api/list/${listId}/tasks`, {
        name: newTaskName,
      })
      setListData((prevList: ListData | null) => ({
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
      await axios.delete(`/api/list/${listId}/tasks/${taskId}`)
      setListData((prevList: ListData | null) => ({
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
    }
  }

  const SaveEdit = async (taskId: number) => {
    if (!editedTaskName.trim()) {
      return
    }

    try {
      await axios.put(`/api/list/${listId}/tasks/${taskId}`, {
        name: editedTaskName,
      })

      setListData((prevList: ListData | null) => ({
        ...prevList!,
        tasks:
          prevList?.tasks.map((task) =>
            task.id === taskId ? { ...task, name: editedTaskName } : task,
          ) || [],
      }))

      setEditingTaskId(null)
      setEditedTaskName('')
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  const CancelEdit = () => {
    setEditingTaskId(null)
    setEditedTaskName('')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (!listData) {
    return <div>Loading...</div>
  }

  if (listData.tasks.length === 0) {
    return <div>No tasks found for list: {listData.listName}</div>
  }

  return (
    <div className="mx-auto max-w-md border border-gray-300 p-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-m font-bold">{listData?.listName}</h1>
        <button
          onClick={handleGoBack}
          className="cursor-pointer text-sm text-blue-500"
        >
          Go Back
        </button>
      </div>
      <ul className="list-disc space-y-2">
        {listData.tasks.map((task) => (
          <li key={task.id} className="flex items-center text-sm text-gray-700">
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  className="mr-2 border border-gray-400 p-1 text-sm"
                />
                <button
                  onClick={() => SaveEdit(task.id)}
                  className="pr-2 text-sm text-green-500 "
                >
                  Save
                </button>
                <button
                  onClick={CancelEdit}
                  className="pl-2 text-sm text-red-600 "
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="mr-2">{task.name}</span>
                <button
                  onClick={() => DeleteTask(task.id)}
                  className="text-red-600"
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
          </li>
        ))}
      </ul>
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
    </div>
  )
}

export default ListDetail