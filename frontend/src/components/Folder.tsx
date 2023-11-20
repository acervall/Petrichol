import {
  useCreateFolder,
  useFolders,
  Folder as IFolder,
  useDeleteFolder,
} from '../store/folderStore'
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

  const handleCreateFolder = async () => {
    try {
      const newFolder = await createFolderMutation.mutateAsync({
        userId: 1,
        folderName,
      })

      setFolderName('')
      queryClient.invalidateQueries('folders')
      navigate(`/folder/${newFolder.id}`)
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
    <div className="mx-auto max-w-md border border-gray-300 bg-green-700 p-4">
      <div>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>
      {data && (
        <ul>
          {data.map((folder: IFolder) => (
            <section
              key={folder.id}
              className="flex items-center justify-between"
            >
              <li key={folder.id}>
                <button onClick={() => handleNavigateToFolder(folder.id)}>
                  {folder.name}
                </button>
              </li>
              <button onClick={() => handleDeleteFolder(folder.id)}>
                Delete
              </button>
            </section>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Folder
