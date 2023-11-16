import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../lib/constants'

interface List {
  id: number
  name: string
  folder_id: number | null
}

const ListDisplay: React.FC = () => {
  const [lists, setLists] = useState<List[]>([])
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState<number | null>(null)
  const [editedListName, setEditedListName] = useState<string>('')
  const navigate = useNavigate()
  const listsNotInFolder = lists.filter((list) => list.folder_id === null)

  useEffect(() => {
    fetch(`${BASE_URL}/api/list`)
      .then((response) => response.json())
      .then((data: List[]) => setLists(data))
      .catch((error) => console.error('Error fetching lists:', error))
  }, [])

  const handleDeleteList = async (listId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('List deleted successfully')
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId))
      } else if (response.status === 404) {
        console.error('List not found')
      } else {
        console.error('Failed to delete list')
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  const handleAddList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName,
          user_id: 1,
          folder_id: null,
        }),
      })

      if (response.ok) {
        const newList = await response.json()
        setLists((prevLists) => [...prevLists, newList])
        setNewListName('')
        console.log('List added successfully')
      } else {
        console.error('Failed to add list')
      }
    } catch (error) {
      console.error('Error adding list:', error)
    }
  }

  const handleEditList = (listId: number) => {
    const listToEdit = lists.find((list) => list.id === listId)
    if (listToEdit) {
      setEditingListId(listId)
      setEditedListName(listToEdit.name)
    }
  }

  const handleSaveEdit = async (listId: number) => {
    if (!editedListName.trim()) {
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedListName,
        }),
      })

      if (response.ok) {
        const updatedList = await response.json()
        setLists((prevLists) =>
          prevLists.map((list) => (list.id === listId ? updatedList : list)),
        )
        console.log('List updated successfully')
      } else if (response.status === 404) {
        console.error('List not found')
      } else {
        console.error('Failed to update list')
      }
    } catch (error) {
      console.error('Error updating list:', error)
    } finally {
      setEditingListId(null)
      setEditedListName('')
    }
  }

  const handleNavigateToList = (listId: number) => {
    navigate(`/lists/${listId}`)
  }

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  const handleSaveEditClick = (
    listId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation()
    handleSaveEdit(listId)
  }

  return (
    <div className="mx-auto mt-10 max-w-md border border-gray-300 p-4">
      <h2>All List</h2>
      <ul>
        {listsNotInFolder.map((list: List) => (
          <li key={list.id}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigateToList(list.id)}
            >
              {editingListId === list.id ? (
                <>
                  <input
                    type="text"
                    value={editedListName}
                    onChange={(e) => setEditedListName(e.target.value)}
                    onClick={handleInputClick}
                  />
                  <button
                    onClick={(e) => handleSaveEditClick(list.id, e)}
                    className="pr-2 text-sm text-green-500"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  {list.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteList(list.id)
                    }}
                    className="pl-10 pr-2 text-sm text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditList(list.id)
                    }}
                    className="pr-2 text-sm text-green-500"
                  >
                    Edit
                  </button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="List name"
        />
        <button onClick={handleAddList}>Add List</button>
      </div>
    </div>
  )
}

export default ListDisplay
