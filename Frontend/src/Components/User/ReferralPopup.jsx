import { addUser } from "@/Redux/Slice/UserSlice";
import axiosInstance from "@/Utils/AxiosConfig";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function ReferralPopup({ isOpen, setIsOpen, user_id, defaultReferralCode }) {
  const [referralCode, setReferralCode] = useState(defaultReferralCode || "");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  ////////////////////////////////////////////////////// handel referral confirm ///////////////////////////////////////////

  async function handleConfirm() {
    try {
      const _id = user_id;
      const response = await axiosInstance.post("/user/referral", {
        referralCode,
        _id,
      });
      dispatch(addUser(response.data.updatedUser));
      toast.success(response.data.message);
      return setIsOpen(false);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
        console.log(err);
      }
    }
  }

  ////////////////////////////////////////////////////// handle Skip //////////////////////////////////////////////////////

  async function handleSkip() {
    try {
      const _id = user_id;

      const response = await axiosInstance.patch("/user/referal/skip", {
        _id,
      });
      dispatch(addUser(response.data.updatedUser));
      if (response.data.success) {
        return setIsOpen(false);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
        console.log(err);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="relative z-[1000]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-lg font-semibold leading-6 text-gray-900"
                    id="modal-title">
                    Enter Referral Code
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Join our referral program and earn rewards! Enter a
                      referral code to get started.
                    </p>
                    <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        How It Works
                      </h4>
                      <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                        <li>Enter a valid referral code</li>
                        <li>Complete your first sign-up</li>
                        <li>Receive ₹200 in your wallet</li>
                        <li>The referrer also gets ₹200 in their wallet</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter referral code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto">
                Confirm
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralPopup;
