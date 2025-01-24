import React from "react";

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#e07d6a] hover:bg-[#9c4f3f] text-white rounded transition-colors">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
