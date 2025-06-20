import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f1] px-6 py-12">
      <div className="text-center">
        <h1 className="text-6xl sm:text-7xl font-bold text-[#8b5d4b] mb-4">
          404
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-6">
          Oops! Page Not Found
        </p>
        <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#e07d6a] hover:bg-[#9c4f3f] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Go back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
