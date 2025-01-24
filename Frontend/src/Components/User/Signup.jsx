import React, { useState } from "react";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import videoLogo from "../../assets/POCKET.mp4";
import axiosInstance from "../../Utils/AxiosConfig";
import { OTPVerification } from "./OTPVerification";
import { Eye, EyeOff } from "lucide-react";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { addUser } from "@/Redux/Slice/UserSlice";
import { useDispatch } from "react-redux";
import { validateSignup } from "../../Utils/ValidationFunctions";

function Signup() {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [googleData, setGoogleData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserFirstName = (event) => setUserFirstName(event.target.value);
  const handleUserLastName = (event) => setUserLastName(event.target.value);
  const handleUserEmail = (event) => setUserEmail(event.target.value);
  const handleUserMobile = (event) => setUserMobile(event.target.value);
  const handleUserPassword = (event) => setUserPassword(event.target.value);
  const handleUserConfirmPassword = (event) =>
    setUserConfirmPassword(event.target.value);

  async function handleSubmission() {
    const validate = validateSignup(
      userFirstName,
      userLastName,
      userEmail,
      userMobile,
      userPassword,
      setError
    );

    // console.log("Validation Result:", validate);
    if (validate) {
      if (userPassword == userConfirmPassword) {
        try {
          setIsLoading(true);
          toast.success("Generating OTP, please wait...");
          const response = await axiosInstance.post("/user/sendotp", {
            userEmail,
          });
          toast.success(response.data.message);
          setShowOTPVerification(true);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            return toast.error(err.response.data.message);
          }
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("confirm password do not match");
      }
    }
  }

  async function handleOTPVerify(otp) {
    try {
      const response = await axiosInstance.post("/user/signup", {
        userFirstName,
        userLastName,
        userEmail,
        userMobile,
        userPassword,
        otp,
      });

      navigate("/login");
      setShowOTPVerification(false);
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
    setShowOTPVerification(false);
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline>
              <source src={videoLogo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Sign Up
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={userFirstName}
                  onChange={handleUserFirstName}
                  placeholder="first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors"
                />
                {error.userFirstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.userFirstName}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={userLastName}
                  onChange={handleUserLastName}
                  placeholder="last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors"
                />
                {error.userFirstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.userFirstName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={handleUserEmail}
                placeholder="abc@.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors"
              />
              {error.userEmail && (
                <p className="text-red-600 text-sm mt-1">{error.userEmail}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={userMobile}
                onChange={handleUserMobile}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors"
              />
              {error.userMobile && (
                <p className="text-red-600 text-sm mt-1">{error.userMobile}</p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={userPassword}
                onChange={handleUserPassword}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 top-6">
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {error.userPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {error.userPassword}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={userConfirmPassword}
                onChange={handleUserConfirmPassword}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 top-6">
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {error.userConfirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {error.userConfirmPassword}
                </p>
              )}
            </div>
            <div className="text-center mb-4">
              <span className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#e07d6a] hover:underline">
                  Log in
                </Link>
              </span>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSubmission}
                disabled={isLoading}
                className="w-full bg-[#e07d6a] text-white py-2 px-4 rounded-md hover:bg-[#9c4f3f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e07d6a] disabled:opacity-50">
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto"
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
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or Continue with
                </span>
              </div>
            </div>
            <div className="w-full flex justify-center mt-5">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const decodeData = jwtDecode(credentialResponse.credential);
                    console.log("decodeData result", decodeData);
                    setGoogleData(decodeData);

                    const response = await axiosInstance.post(
                      "/user/googleAuth",
                      {
                        sub: decodeData.sub,
                        name: decodeData.name,
                        email: decodeData.email,
                      }
                    );
                    if (response.data.success) {
                      toast.success(response.data.message);
                      dispatch(addUser(response.data.userData));
                      navigate("/home");
                    }
                  } catch (err) {
                    if (err.response && err.response.status === 401) {
                      return toast.error(err.response.data.message);
                    }
                    console.log(err);

                    toast.error("An error occurred. Please try again.");
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <OTPVerification
        handleSignUp={handleSubmission}
        isOpen={showOTPVerification}
        onClose={() => setShowOTPVerification(false)}
        onVerify={handleOTPVerify}
        email={userEmail}
      />
    </div>
  );
}

export default Signup;
