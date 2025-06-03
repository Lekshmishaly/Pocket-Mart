import { useState } from "react";

const OrderReturn = ({
  setShowReturnPopup,
  handleReturnConfirm,
  selectedProductId,
  orderID,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [explanation, setExplanation] = useState("");

  const returnReasons = [
    "Color Mismatch",
    "Item is Defective/Damaged",
    "Quality Not as Expected",
    "Size Issue",
    "Wrong Item Delivered",
    "Item Arrived Late",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#d0c4b5] p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-[#955238] text-lg font-semibold mb-4 text-center">
          Return Order
        </h2>
        <p className="text-[#6d483a] mb-4 text-center">
          Are you sure you want to return this order?
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
          {returnReasons.map((reason) => (
            <div
              key={reason}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedReason === reason
                  ? "bg-[#b98a78] text-white border-[#713d28]"
                  : "bg-[#ece3d9] text-[#8b5d4b] border-[#d4c9bc] hover:bg-[#e8dac8]"
              }`}
              onClick={() => setSelectedReason(reason)}>
              {reason}
            </div>
          ))}
        </div>

        <textarea
          className="w-full p-2 border rounded-md text-[#8b5d4b] bg-[#ece3d9]"
          rows="3"
          placeholder="Explain your reason (optional)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => setShowReturnPopup(false)}
            className="px-4 py-2 bg-[#ece3d9] text-[#8b5d4b] rounded hover:bg-[#e8dac8]">
            Cancel
          </button>
          <button
            onClick={() =>
              handleReturnConfirm(
                selectedReason,
                explanation,
                selectedProductId,
                orderID
              )
            }
            className="px-4 py-2 bg-[#955238] text-white rounded hover:bg-[#713d28]"
            disabled={!selectedReason}>
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReturn;
