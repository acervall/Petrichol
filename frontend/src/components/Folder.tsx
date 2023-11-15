import { useEffect, useState } from 'react'
import axios from 'axios'
import ConfirmationModal from './ConfirmationModal'

interface FolderProps {
  id: number
  name: string
  user_id: number
}

const Folder: React.FC = () => {
  const [folders, setFolders] = useState<FolderProps[]>([])
  const [folderName, setFolderName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('/api/folder/')
        console.log('Successfully fetched all folders: ', response.data)

        setFolders(response.data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchFolders()
  }, [])

  const createFolder = async () => {
    try {
      const response = await axios.post('/api/folder/', { name: folderName })
      console.log('Folder created:', response.data)
      setFolderName('')
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const deleteFolder = async (id: number) => {
    try {
      await axios.delete(`/api/folder/${id}`)
      console.log('Successfully deleted folder!')
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== id),
      )
    } catch (error) {
      console.error('Error deleting folder: ', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold">Create a New Folder</h2>
        <label className="mb-2 block">
          Folder Name:
          <input
            className="w-full rounded border px-2 py-1"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </label>
        <section>
          <button
            className="rounded bg-blue-500 px-4 py-1 text-white"
            onClick={createFolder}
          >
            Create Folder
          </button>
        </section>
      </div>
      <h2 className="mb-2 text-2xl font-bold">All Folders</h2>

      <ul>
        {folders.map((folder) => (
          <section className="mb-2">
            <li key={folder.id} className="mr-2 inline-block border p-2">
              {folder.name}
            </li>
            <button onClick={openModal}>Delete</button>
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onYes={() => deleteFolder(folder.id)}
              onNo={closeModal}
              title="Delete folder"
              message="Are you sure you want to delete this folder?"
            />
          </section>
        ))}
      </ul>
    </div>
  )
}

export default Folder
