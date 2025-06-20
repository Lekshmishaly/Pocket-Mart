import { modal } from "@heroui/theme";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";

const PaymentComponent = ({ amount, onSuccess, onFailure, address, title }) => {
  const { Razorpay } = useRazorpay();

  const handlePayment = () => {
    if (Object.keys(address).length === 0) {
      return toast.warning("Address is not selected");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      handler: (response) => {
        if (response.razorpay_payment_id) {
          onSuccess(response);
        } else {
          onFailure(response);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure();
        },
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#8b5d4b",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  // ----------------- RETRY PAYMENT SIMPLE VIEW -------------------
  if (title === "Retry Payment") {
    return (
      <div className="max-w-sm mx-auto p-3 bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4 text-sm text-[#6d483a]">
          <span>Amount:</span>
          <span className="font-semibold text-[#8b5d4b]">
            ₹{Math.round(amount).toLocaleString("en-IN")}.00
          </span>
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={handlePayment}
            className="px-3 py-1 bg-[#8b5d4b] hover:bg-[#6d483a] text-white text-xs font-medium rounded-md transition duration-200">
            {title}
          </button>
        </div>
      </div>
    );
  }

  // ----------------- PAY NOW DEFAULT FULL STYLE -------------------
  return (
    <div className="w-full px-4 sm:px-5 md:px-6 max-w-md mx-auto rounded-xl shadow-md overflow-hidden py-5 sm:py-6 md:py-8 bg-white border border-gray-100">
      <div className="flex flex-col space-y-6">
        {/* Amount to Pay Block */}
        <div className="bg-[#f9f5f2] p-4 sm:p-5 rounded-lg w-full">
          <div className="flex flex-col items-center justify-center text-center gap-1">
            <span className="text-[#6d483a] font-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
              Amount to Pay:
            </span>
            <span className="text-[#8b5d4b] font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]">
              ₹{Math.round(amount).toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full py-3 sm:py-3.5 md:py-4 bg-[#8b5d4b] hover:bg-[#6d483a] text-white font-medium rounded-md transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
          <span className="flex items-center text-sm sm:text-base md:text-lg">
            {title}
          </span>
        </button>

        {/* Razorpay Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2 text-center">
          <div className="text-xs sm:text-sm text-[#8b5d4b] font-medium">
            Secured by Razorpay Payment Gateway
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#8b5d4b] mx-auto sm:mx-0"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
