import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../lib/constants'

interface List {
  id: number
  name: string
}

interface Folder {
  id: number
  name: string
  lists: List[]
}

const FolderDetails: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>()
  const [folder, setFolder] = useState<Folder | null>(null)
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState<number | null>(null)
  const [editedListName, setEditedListName] = useState<string>('')
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        const apiUrl = `${BASE_URL}/api/folder/${folderId}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          console.error(
            `Error fetching folder details. Status: ${response.status}`,
          )
          return
        }

        const folderData: Folder = await response.json()
        setFolder(folderData)
      } catch (error) {
        console.error('Error fetching folder details:', error)
      }
    }

    if (folderId) {
      fetchFolderDetails()
    }

    return () => {}
  }, [folderId])

  const handleListClick = (listId: number) => {
    navigate(`/lists/${listId}`)
  }

  const handleDeleteList = async (listId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('List deleted successfully')
        setFolder((prevFolder) => {
          if (prevFolder) {
            const updatedLists = prevFolder.lists.filter(
              (list) => list.id !== listId,
            )
            return { ...prevFolder, lists: updatedLists }
          }
          return prevFolder
        })
      } else if (response.status === 404) {
        console.error('List not found')
      } else {
        console.error('Failed to delete list')
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  const handleEditList = (listId: number, folderId: number | null) => {
    const listToEdit = folder?.lists.find((list) => list.id === listId)
    if (listToEdit) {
      setEditingListId(listId)
      setEditedListName(listToEdit.name)
      setSelectedFolder(folderId || null)
    }
  }

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    setSelectedFolder(Number(e.target.value) || null)
  }

  const handleSelectMouseDown = (e: React.MouseEvent<HTMLSelectElement>) => {
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
          folder_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const updatedList = await response.json()
        setFolder((prevFolder) =>
          prevFolder
            ? {
                ...prevFolder,
                lists: prevFolder.lists.map((list) =>
                  list.id === listId ? updatedList : list,
                ),
              }
            : prevFolder,
        )

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

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  const handleCancelEdit = () => {
    setEditingListId(null)
    setEditedListName('')
    setSelectedFolder(null)
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
          folder_id: folderId,
        }),
      })

      if (response.ok) {
        const newList = await response.json()

        setFolder((prevFolder) => {
          if (prevFolder) {
            const updatedLists = [...prevFolder.lists, newList]
            return { ...prevFolder, lists: updatedLists }
          }
          return prevFolder
        })

        setNewListName('')
        console.log('List added successfully')
      } else {
        console.error('Failed to add list')
      }
    } catch (error) {
      console.error('Error adding list:', error)
    }
  }

  return (
    <div className="mx-auto max-w-md border border-gray-300 bg-blue-100 p-4">
      <h2 className="text-m font-bold">{folder?.name}</h2>
      {folder?.lists && folder.lists.length > 0 ? (
        folder.lists.map((list) => (
          <div
            key={list.id}
            onClick={() => handleListClick(list.id)}
            style={{ cursor: 'pointer' }}
          >
            <h4>
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
                    style={{ display: 'none' }}
                  ></select>
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
                      handleEditList(list.id, folder?.id)
                    }}
                    className="pr-2 text-sm text-green-500"
                  >
                    Edit
                  </button>
                </>
              )}
            </h4>
          </div>
        ))
      ) : (
        <div>No lists found for this folder</div>
      )}
      <div>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
        />
        <button onClick={handleAddList}>Add List</button>
      </div>
    </div>
  )
}

export default FolderDetails
