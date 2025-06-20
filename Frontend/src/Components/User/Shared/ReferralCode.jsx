import React, { useState } from "react";

function ReferralCode({ referralCode }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareReferralLink = () => {
    const message = `Hey! Sign up on Pocket Mart and use my referral code '${referralCode}' to get ₹200 in your wallet. Click to join: http://localhost:5173/signup?ref=${referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-[#e2dacd] border border-[#8b5d4b] rounded-lg shadow-md p-6 w-full max-w-6xl mt-5">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8b5d4b] mb-4 text-center sm:text-left">
        Pocket Mart Referral Program
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How It Works Section */}
        <div className="bg-[#f4ede3] border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 text-[#8b5d4b]">
            How It Works
          </h3>
          <p className="text-sm sm:text-base text-[#8b5d4b] mb-4 leading-relaxed">
            Share your referral code with friends. When someone uses your code
            after their first sign-up:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-[#8b5d4b] space-y-2">
            <li>You'll receive ₹200 in your wallet</li>
            <li>Your friend will also get ₹200 in their wallet</li>
          </ul>
        </div>

        {/* Referral Code Section */}
        <div className="bg-[#f4ede3] border border-[#733519] rounded-lg p-4 flex flex-col justify-center">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 text-[#df672f]">
            Your Referral Code
          </h3>

          <div className="flex items-center justify-between bg-[#f3e8da] border border-[#733519] rounded-lg p-3">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#733519]">
              {referralCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="text-[#733519] hover:text-[#5a2e16] focus:outline-none transition-colors duration-200"
              aria-label="Copy referral code">
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>

          {copied && (
            <p className="mt-2 text-xs sm:text-sm text-green-600">
              Copied to clipboard!
            </p>
          )}

          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#733519] leading-relaxed">
            Share this code with your friends to start earning rewards!
          </p>

          <button
            onClick={shareReferralLink}
            className="bg-green-500 text-white mt-4 py-2 px-4 rounded hover:bg-green-600 text-sm sm:text-base">
            Share via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReferralCode;
