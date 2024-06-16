import { XMarkIcon } from "@heroicons/react/24/solid";

function Modal({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-10">
          <div className="bg-white p-5 rounded-lg w-full xl:w-[52rem]">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 p-1 rounded-lg hover:bg-red-400 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            {children}
            {/* botones */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-gray-800 font-medium mr-2 transition-colors duration-300 ease-in-out"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;