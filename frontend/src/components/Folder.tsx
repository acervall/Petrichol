import { useCreateFolder, useFolders, Folder as IFolder, useDeleteFolder } from '../store/folderStore'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import * as Preloads from '../lib/preloads'

const Folder: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, error, isLoading } = useFolders()
  const [folderName, setFolderName] = useState('')
  const createFolderMutation = useCreateFolder()
  const deleteFolderMutation = useDeleteFolder()
  const navigate = useNavigate()
  const [showDeleteButtons, setShowDeleteButtons] = useState(false)
  const [showAddFunction, setShowAddFunction] = useState(false)

  const handleCreateFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()

      await createFolderMutation.mutateAsync({
        userId: 1,
        folderName,
      })

      setFolderName('')
      queryClient.invalidateQueries('folders')
      setShowAddFunction(false)
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleDeleteFolder = async (id: number) => {
    try {
      await deleteFolderMutation.mutateAsync(id)
      queryClient.invalidateQueries('folders')
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  const handleNavigateToFolder = async (folderId: number) => {
    console.log(Preloads)
    await Preloads.FolderDetails.preload()
    navigate(`/folder/${folderId}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="relative mx-auto mt-10 max-w-lg p-2 ">
      <div className="flex justify-end space-x-4 pr-5">
        {/* Plus sign SVG */}
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
          className="cursor-pointer text-black hover:text-blue-500"
          onClick={() => setShowAddFunction(!showAddFunction)}
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>

        {/* Trash sign SVG */}
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
      <ul className="grid grid-cols-2 gap-4 p-5">
        {data &&
          data.map((folder: IFolder) => (
            <li
              key={folder.id}
              className=" relative flex flex-col items-center rounded-md  bg-stone-300 p-4 shadow-md hover:bg-stone-400"
            >
              {/* Individual Trash SVG */}
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
                  className="absolute right-2 top-2 z-10 cursor-pointer text-black hover:text-red-500"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              )}

              <button onClick={() => handleNavigateToFolder(folder.id)} className="flex flex-col items-center text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black-500 mb-2"
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                </svg>
                <span>{folder.name}</span>
              </button>
            </li>
          ))}
      </ul>
      {showAddFunction && (
        <div className="mt-4 flex items-center pl-2 pr-2">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="mr-2 flex-grow rounded-md border border-gray-300 p-1 text-xs"
            placeholder="Folder name"
          />
          <button onClick={handleCreateFolder} className="rounded-md bg-stone-500 px-2 py-1 text-xs text-white">
            +
          </button>
        </div>
      )}
    </div>
  )
}

export default Folder
