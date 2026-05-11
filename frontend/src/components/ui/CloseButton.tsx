"use client";

interface CloseButtonProps {
  onClose: () => void;
}

function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 py-1 px-3"
    >
      Close
    </button>
  );
}

export default CloseButton;
