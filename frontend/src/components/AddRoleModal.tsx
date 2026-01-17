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
          <h2 className="mb-2 text-xl border-b-2">Add a new role</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="role_name"
                className="block text-sm font-medium mb-2"
              >
                Role *
              </label>
              <input
                id="role_name"
                type="text"
                name="role_name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="General Manager"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="staff_name"
                className="block text-sm font-medium mb-2"
              >
                Staff Name
              </label>
              <input
                id="staff_name"
                type="text"
                name="staff_name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tom Waits"
              />
            </div>
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
          </form>
        </div>
      </div>
    </>
  );
}

export default AddRoleModal;
