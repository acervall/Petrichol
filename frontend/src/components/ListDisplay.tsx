import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../lib/constants'
import * as Preloads from '../lib/preloads'

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
  const [showDeleteButtons, setShowDeleteButtons] = useState(false)
  //const [showAddFunction, setShowAddFunction] = useState(false)
  const [showEditButtons, setShowEditButtons] = useState(false)
  const userId = '1'

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
        console.log('Received lists:', data)
        setLists(data)
        setListsNotInFolder(data.filter((list) => !list.folder_id))
      })
      .catch((error) => console.error('Error fetching lists:', error))
  }, [selectedFolder])

  useEffect(() => {
    const filteredLists = Array.isArray(lists) ? lists.filter((list) => !list.folder_id) : []
    setListsNotInFolder(filteredLists)
  }, [lists])

  const handleDeleteList = async (listId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/list/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
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
          'user-id': userId,
        },
        body: JSON.stringify({
          name: newListName,
          user_id: 1,
          folder_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const newList = await response.json()

        setLists((prevLists) => [...prevLists, newList])

        setNewListName('')
        setSelectedFolder(null)
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
          'user-id': userId,
        },
        body: JSON.stringify({
          name: editedListName,
          folder_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const updatedList = await response.json()
        setLists((prevLists) => prevLists.map((list) => (list.id === listId ? updatedList : list)))

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

  const handleNavigateToList = async (listId: number) => {
    await Preloads.ListDetails.preload()
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
    <div className="m-10 mx-auto mt-10 max-w-lg  p-2">
      <div className="flex justify-end space-x-4 pr-5">
        <svg
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
          onClick={() => setShowEditButtons(!showEditButtons)}
        >
          <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer text-black hover:text-red-500"
          onClick={() => setShowDeleteButtons(!showDeleteButtons)}
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>
      <ul className="space-y-4 p-5">
        {listsNotInFolder.map((list: List) => (
          <li
            key={list.id}
            className="flex items-center  justify-between rounded-md rounded-md bg-stone-300  p-2 shadow-md hover:bg-stone-400"
          >
            <span className="flex w-full cursor-pointer items-center" onClick={() => handleNavigateToList(list.id)}>
              {editingListId === list.id ? (
                <div className="flex w-full items-center justify-between space-x-2">
                  <div className="flex w-full items-center space-x-2">
                    <input
                      type="text"
                      value={editedListName}
                      onChange={(e) => setEditedListName(e.target.value)}
                      onClick={handleInputClick}
                      className="flex-grow rounded-md border border-gray-300 p-1 text-xs"
                    />
                    <select
                      value={selectedFolder || ''}
                      onChange={handleFolderChange}
                      onMouseDown={handleSelectMouseDown}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-gray-300 p-1 text-xs"
                    >
                      <option value=""> </option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveEditClick(list.id, e)
                      }}
                      className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancelEdit()
                      }}
                      className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between space-x-2">
                  <span className="text-sm">{list.name}</span>
                  <div className="flex items-center space-x-2">
                    {showDeleteButtons && (
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
                        className=" cursor-pointer text-black hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteList(list.id)
                        }}
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="9" y1="14" x2="15" y2="14" />
                      </svg>
                    )}
                    {showEditButtons && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditList(list.id, list.folder_id)
                        }}
                        className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center pb-10 pl-5 pr-5">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="List name"
          className="mr-2 flex-grow rounded-md border border-gray-300 p-1 text-sm"
        />
        <select
          value={selectedFolder || ''}
          onChange={handleFolderChange}
          onMouseDown={handleSelectMouseDown}
          className="mr-2 rounded-md border border-gray-300 p-1 text-sm"
        >
          <option value=""> </option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddList} className="rounded-md bg-stone-500 px-2 py-1 text-sm text-white">
          +
        </button>
      </div>
    </div>
  )
}

export default ListDisplay
