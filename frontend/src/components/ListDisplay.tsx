import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../lib/constants'

interface List {
  id: number
  name: string
  folder_id: number | null
}

interface Folder {
  id: number
  name: string
}

const ListDisplay: React.FC = () => {
  const [lists, setLists] = useState<List[]>([])
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState<number | null>(null)
  const [editedListName, setEditedListName] = useState<string>('')
  const navigate = useNavigate()
  const [listsNotInFolder, setListsNotInFolder] = useState<List[]>([])
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    fetch(`${BASE_URL}/api/folder`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch folders. Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: Folder[]) => setFolders(data))
      .catch((error) => console.error('Error fetching folders:', error))
  }, [])

  useEffect(() => {
    fetch(`${BASE_URL}/api/list`)
      .then((response) => response.json())
      .then((data: List[]) => {
        setLists(data)
        setListsNotInFolder(data.filter((list) => !list.folder_id))
      })
      .catch((error) => console.error('Error fetching lists:', error))
  }, [selectedFolder])

  useEffect(() => {
    // Filter lists when the lists state changes
    const filteredLists = lists.filter((list) => !list.folder_id)
    setListsNotInFolder(filteredLists)
  }, [lists]) // Add lists as a dependency

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
          folder_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const newList = await response.json()
        // Update the lists state correctly based on whether it's added to a folder or not
        setLists((prevLists) => [...prevLists, newList])

        setNewListName('')
        setSelectedFolder(null) // Reset the selected folder after adding the list
        console.log('List added successfully')
      } else {
        console.error('Failed to add list')
      }
    } catch (error) {
      console.error('Error adding list:', error)
    }
  }

  const handleEditList = (listId: number, folderId: number | null) => {
    const listToEdit = lists.find((list) => list.id === listId)
    if (listToEdit) {
      setEditingListId(listId)
      setEditedListName(listToEdit.name)
      setSelectedFolder(folderId || null) // Set the selectedFolder to folderId
    }
  }

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Stop the event propagation to prevent navigation
    e.stopPropagation()
    setSelectedFolder(Number(e.target.value) || null)
  }

  const handleSelectMouseDown = (e: React.MouseEvent<HTMLSelectElement>) => {
    // Stop the event propagation to prevent navigation
    e.stopPropagation()
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
          folder_id: selectedFolder, // Make sure selectedFolder is included in the body
        }),
      })

      if (response.ok) {
        const updatedList = await response.json()
        setLists((prevLists) =>
          prevLists.map((list) => (list.id === listId ? updatedList : list)),
        )

        // Log whether the list is moved to the selected folder
        console.log(
          `List "${updatedList.name}" (ID: ${listId}) ${
            selectedFolder
              ? `moved to folder ${selectedFolder}`
              : 'removed from folder'
          }`,
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

  const handleSaveEditClick = (
    listId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation()
    handleSaveEdit(listId)
  }

  const handleNavigateToList = (listId: number) => {
    navigate(`/lists/${listId}`)
  }

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  const handleCancelEdit = () => {
    setEditingListId(null)
    setEditedListName('')
    setSelectedFolder(null)
  }

  return (
    <div
      className="mx-auto mt-10 border border-gray-300 p-4"
      style={{ maxWidth: '600px' }}
    >
      <h2 className="pb-10 ">All List</h2>
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
                  <select
                    value={selectedFolder || ''}
                    onChange={handleFolderChange}
                    onMouseDown={handleSelectMouseDown}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Add to folder if wanted</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveEditClick(list.id, e)
                    }}
                    className="pr-2 text-sm text-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelEdit()
                    }}
                    className="pl-2 text-sm text-red-600"
                  >
                    Cancel
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
                    className="ml-10 pl-10 pr-2 text-sm text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditList(list.id, list.folder_id)
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
        <select
          value={selectedFolder || ''}
          onChange={handleFolderChange}
          onMouseDown={handleSelectMouseDown}
        >
          <option value="">Add to folder if wanted</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddList}>Add List</button>
      </div>
    </div>
  )
}

export default ListDisplay
