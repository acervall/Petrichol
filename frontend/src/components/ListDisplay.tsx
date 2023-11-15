import React, { useState, useEffect } from 'react'

interface List {
  id: number
  name: string
}

const ListDisplay: React.FC = () => {
  const [lists, setLists] = useState<List[]>([])
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState<number | null>(null)
  const [editedListName, setEditedListName] = useState<string>('')

  useEffect(() => {
    fetch('/api/list')
      .then((response) => response.json())
      .then((data: List[]) => setLists(data))
      .catch((error) => console.error('Error fetching lists:', error))
  }, [])

  const handleDeleteList = async (listId: number) => {
    try {
      const response = await fetch(`/api/list/${listId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('List deleted successfully')
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId))
      } else {
        console.error('Failed to delete list')
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  const handleAddList = async () => {
    try {
      const response = await fetch('/api/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName,
          user_id: 1, // Replace with the actual user ID or get it dynamically
          folder_id: null, // Replace with the actual folder ID if applicable
        }),
      })

      if (response.ok) {
        const newList = await response.json()
        setLists((prevLists) => [...prevLists, newList])
        setNewListName('') // Clear the input after adding a new list
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
      const response = await fetch(`/api/list/${listId}`, {
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

  return (
    <div>
      <h2>All Lists</h2>
      <ul>
        {lists.map((list: List) => (
          <li key={list.id}>
            {editingListId === list.id ? (
              <>
                <input
                  type="text"
                  value={editedListName}
                  onChange={(e) => setEditedListName(e.target.value)}
                />
                <button
                  onClick={() => handleSaveEdit(list.id)}
                  className="pr-2 text-sm text-green-500"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {list.name}
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="pr-2 text-sm text-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditList(list.id)}
                  className="pr-2 text-sm text-green-500"
                >
                  Edit
                </button>
              </>
            )}
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
