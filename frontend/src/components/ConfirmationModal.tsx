interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onYes: () => void
  onNo: () => void
  title: string
  message: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onYes, onNo, title, message }) => {
  return (
    isOpen && (
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="rounded bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
              onClick={onYes}
            >
              Yes
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
              onClick={onNo}
            >
              No
            </button>
          </div>
          <button
            className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  )
}

export default ConfirmationModal
