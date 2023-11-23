import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../lib/constants'
import { useLocalStorageId } from '../store/userStore'

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
  const [showDelete, setShowDelete] = useState(false)
  const toggleShowDelete = () => setShowDelete(!showDelete)
  const [showEdit, setShowEdit] = useState(false)
  const storageUser = useLocalStorageId()
  const userId = storageUser.data

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        if (!userId) return
        const response = await fetch(`${BASE_URL}/api/folder/${folderId}`, {
          headers: { 'user-id': userId?.toString() },
        })

        if (!response.ok) {
          console.error(`Error fetching folder details. Status: ${response.status}`)
          return
        }

        const folderData: Folder = await response.json()
        setFolder(folderData)
      } catch (error) {
        console.error('Error fetching folder details:', error)
      }
    }

    if (folderId && userId) {
      fetchFolderDetails()
    }

    return () => {}
  }, [folderId, userId])

  const handleListClick = (listId: number) => {
    navigate(`/lists/${listId}`)
  }

  const handleDeleteList = async (listId: number) => {
    try {
      if (!userId) return
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'DELETE',
        headers: { 'user-id': userId?.toString() },
      })

      if (response.ok) {
        console.log('List deleted successfully')
        setFolder((prevFolder) => {
          if (prevFolder) {
            const updatedLists = prevFolder.lists.filter((list) => list.id !== listId)
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
      if (!userId) return
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId?.toString(),
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
                lists: prevFolder.lists.map((list) => (list.id === listId ? updatedList : list)),
              }
            : prevFolder,
        )

        console.log(
          `List "${updatedList.name}" (ID: ${listId}) ${
            selectedFolder ? `moved to folder ${selectedFolder}` : 'removed from folder'
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

  const handleSaveEditClick = (listId: number, e: React.MouseEvent<HTMLButtonElement>) => {
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
      if (!userId) return
      const response = await fetch(`${BASE_URL}/api/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId?.toString(),
        },
        body: JSON.stringify({
          name: newListName,
          user_id: userId,
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

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <>
      <button onClick={handleGoBack} className="cursor-pointer p-4 text-xs text-stone-500">
        Go Back
      </button>
      <div className="m-10 mx-auto mt-10 max-w-lg p-2">
        <h1 className="text-m pl-5 font-bold">{folder?.name}</h1>
        <div className="">
          <div className="flex justify-end space-x-4 pr-5">
            {/* Edit sign SVG */}
            <svg
              onClick={() => setShowEdit(!showEdit)}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className=""
            >
              <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
            </svg>
            {/* Trash sign SVG */}
            <svg
              onClick={toggleShowDelete}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
        </div>

        {folder?.lists && folder.lists.length > 0 ? (
          <ul className="space-y-4 p-5">
            {folder.lists.map((list) => (
              <li
                key={list.id}
                onClick={() => handleListClick(list.id)}
                className="flex items-center  justify-between rounded-md bg-stone-300 p-2  text-xs shadow-md hover:bg-stone-400"
                style={{ cursor: 'pointer' }}
              >
                {editingListId === list.id ? (
                  <>
                    <input
                      type="text"
                      value={editedListName}
                      onChange={(e) => setEditedListName(e.target.value)}
                      className="flex-grow rounded-md border border-gray-300 p-1 text-xs"
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
                      className="m-1 rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancelEdit()
                      }}
                      className="m-1 rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {' '}
                    {list.name}
                    <div className="flex ">
                      {showDelete && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1 mt-1 justify-center  text-black hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteList(list.id)
                            toggleShowDelete()
                          }}
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="9" y1="14" x2="15" y2="14" />
                        </svg>
                      )}
                      {showEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditList(list.id, folder?.id)
                          }}
                          className="m-1 rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="ml-4 text-xs text-red-500">No lists found in this folder</div>
        )}
        <div className="mt-4 flex items-center pb-10 pl-5 pr-5 text-xs">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="mr-2 flex-grow rounded-md border border-gray-300 p-1 text-xs"
            placeholder="List Name"
          />
          <button onClick={handleAddList} className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white">
            +
          </button>
        </div>
      </div>
    </>
  )
}

export default FolderDetails
