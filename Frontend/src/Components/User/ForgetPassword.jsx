import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const OtpInput = ({ value, onChange }) => {
  const inputRefs = Array(5)
    .fill(0)
    .map(() => React.createRef());

  const handleChange = (index, e) => {
    const newValue = e.target.value;
    if (newValue.length <= 1) {
      const newOtp = value.split("");
      newOtp[index] = newValue;
      onChange(newOtp.join(""));
      if (newValue.length === 1 && index < 4) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && value[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="flex justify-between">
      {[0, 1, 2, 3, 4].map((index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-xl border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-[#e07d6a] focus:border-[#e07d6a] hover:border-[#e07d6a]"
        />
      ))}
    </div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (step === 1) {
        // Step 1: Request OTP
        const response = await axiosInstance.post("/user/forget-password", {
          userEmail: email,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setStep(2);
        } else {
          toast.error(response.data.message);
        }
      } else if (step === 2) {
        // Step 2: Verify OTP
        const response = await axiosInstance.post("/user/verify-otp", {
          userEmail: email,
          otp: resetCode,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setStep(3);
        } else {
          toast.error(response.data.message);
        }
      } else if (step === 3) {
        // Step 3: Reset Password
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
        } else {
          const response = await axiosInstance.post("/user/reset-password", {
            newPassword,
            confirmPassword,
            userEmail: email,
          });
          if (response.data.success) {
            toast.success(response.data.message);
            navigate("/login");
          } else {
            toast.error(response.data.message);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e07d6a] focus:border-[#e07d6a] hover:border-[#e07d6a]"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="resetCode"
                className="block text-sm font-medium text-gray-700">
                Reset Code
              </label>
              <OtpInput value={resetCode} onChange={setResetCode} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordStrength(
                      calculatePasswordStrength(e.target.value)
                    );
                  }}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e07d6a] focus:border-[#e07d6a] hover:border-[#e07d6a]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showNewPassword ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ease-in-out ${
                      passwordStrength < 2
                        ? "bg-red-500"
                        : passwordStrength < 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {passwordStrength < 2
                    ? "Weak"
                    : passwordStrength < 4
                    ? "Medium"
                    : "Strong"}{" "}
                  password
                </p>
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e07d6a] focus:border-[#e07d6a] hover:border-[#e07d6a]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > s
                      ? "bg-green-500 text-white"
                      : step === s
                      ? "bg-[#e07d6a] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className="text-xs mt-1 text-gray-500">
                  {s === 1 ? "Email" : s === 2 ? "Verify" : "Reset"}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e07d6a] hover:bg-[#9c4f3f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e07d6a] ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {step === 1
                  ? "Send Reset Code"
                  : step === 2
                  ? "Verify Code"
                  : "Reset Password"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-[#e07d6a] hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
