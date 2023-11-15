
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
  title: string;
  message: string;
}

const ConfirmationModal:  React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onYes, onNo, title, message }) => {
  return (
    isOpen && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="mb-4">{message}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                onClick={onYes}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={onNo}
              >
                No
              </button>
            </div>
            <button
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )
  );
};

export default ConfirmationModal;
