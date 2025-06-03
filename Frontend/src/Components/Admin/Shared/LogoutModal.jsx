import ReactDOM from "react-dom";

export default function LogoutModal({ onClose, onConfirm }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="px-4 py-2 bg-[#e07d6a] text-white rounded hover:bg-[#c56a59] transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
