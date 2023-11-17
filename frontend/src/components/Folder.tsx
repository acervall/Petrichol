import {
  useCreateFolder,
  useFolders,
  Folder as IFolder,
  useDeleteFolder,
} from '../store/folderStore'
import { useState } from 'react'

const Folder: React.FC = () => {
  const { data, error, isLoading } = useFolders()
  const [folderName, setFolderName] = useState('')
  const createFolderMutation = useCreateFolder()
  const deleteFolderMutation = useDeleteFolder()

  const handleCreateFolder = async () => {
    try {
      await createFolderMutation.mutateAsync({ userId: 1, folderName })
      setFolderName('')
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleDeleteFolder = async (id: number) => {
    try {
      await deleteFolderMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
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
            <section key={folder.id}>
              <li key={folder.id}>{folder.name}</li>
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
