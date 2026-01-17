"use client";

interface AddModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

function AddRoleModal({ isModalOpen, onClose }: AddModalProps) {
  if (!isModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 "
        onClick={onClose}
      >
        <div
          className="bg-black rounded-lg p-6 max-w-md w-full mx-4 border-2 border-white"
          onClick={(e: React.MouseEvent) => e.stopPropagation()} //Prevents clicks inside the modal from bubbling up to the backdrop
        >
          <div className="border-b-2">
            <h2 className="mb-2 text-xl">Add a new role</h2>
          </div>
          <div className="mb-6"></div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
            >
              Close
            </button>
            <button className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2">
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddRoleModal;
