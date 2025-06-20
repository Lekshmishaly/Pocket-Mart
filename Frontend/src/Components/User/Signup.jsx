import React, { useState } from "react";

import { toast } from "sonner";
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

    // ("Validation Result:", validate);
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
    <div className="bg-[#e8d1b3] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl md:flex overflow-hidden">
        {/* Video Logo Section (optional for larger screens) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#b48c78] w-1/2 p-6">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg mb-4">
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
          <h3 className="text-lg text-[#f4efee] font-semibold text-center">
            𝙿𝚘𝚌𝚔𝚎𝚝 𝙼𝚊𝚛𝚝
          </h3>
        </div>

        {/* Signup Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="md:hidden w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-md">
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

          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-500 mb-6">
            Sign Up
          </h2>

          <div className="space-y-5 text-sm md:text-base">
            {/* Names Row */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block mb-1 font-medium text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={userFirstName}
                  onChange={handleUserFirstName}
                  placeholder="first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none"
                />
                {error.userFirstName && (
                  <p className="text-red-600 text-xs mt-1">
                    {error.userFirstName}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block mb-1 font-medium text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={userLastName}
                  onChange={handleUserLastName}
                  placeholder="last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none"
                />
                {error.userFirstName && (
                  <p className="text-red-600 text-xs mt-1">
                    {error.userFirstName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={handleUserEmail}
                placeholder="abc@.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none"
              />
              {error.userEmail && (
                <p className="text-red-600 text-xs mt-1">{error.userEmail}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="mobile"
                className="block mb-1 font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={userMobile}
                onChange={handleUserMobile}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none"
              />
              {error.userMobile && (
                <p className="text-red-600 text-xs mt-1">{error.userMobile}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={userPassword}
                onChange={handleUserPassword}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3">
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {error.userPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {error.userPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={userConfirmPassword}
                onChange={handleUserConfirmPassword}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#e07d6a] focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3">
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {error.userConfirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {error.userConfirmPassword}
                </p>
              )}
            </div>

            {/* Already have account */}
            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#f26925] hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <button
                onClick={handleSubmission}
                disabled={isLoading}
                className="w-full bg-[#f26925] text-white py-2 rounded-md hover:bg-[#9c4f3f] transition disabled:opacity-50">
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none">
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or Continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const decodeData = jwtDecode(credentialResponse.credential);
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
                      dispatch(addUser(response.data.userData));
                      toast.success(response.data.message);
                      navigate("/");
                    }
                  } catch (err) {
                    if (err.response && err.response.status === 401) {
                      return toast.error(err.response.data.message);
                    }
                    toast.error("An error occurred. Please try again.");
                  }
                }}
                onError={() => console.log("Login Failed")}
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
