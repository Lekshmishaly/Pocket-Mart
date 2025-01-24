import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Link, useNavigate } from "react-router-dom";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";
import axiosInstance from "@/Utils/AxiosConfig";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "@/Redux/Slice/UserSlice";
import { toast as reactToast, ToastContainer } from "react-toastify";

export default function LoginPage() {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user.userDetails);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [googleData, setGoogleData] = useState(null);

  const navigate = useNavigate();
  const handleUserEmail = (event) => setUserEmail(event.target.value);
  const handleUserPassword = (event) => setUserPassword(event.target.value);

  async function handleLoginSubmission() {
    try {
      const response = await axiosInstance.post("/user/login", {
        userEmail,
        userPassword,
      });
      setIsLoading(true);

      dispatch(addUser(response.data.userData));
      navigate("/home");
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return toast.error(err.response.data.message);
      }
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      if (err.response && err.response.status === 403) {
        return reactToast.error(
          <>
            <strong>Error 403:</strong> {err.response.data.message}
            <br />
            <strong>Contact the Admin for Further Details</strong>
          </>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }

      toast.error("An error occurred. Please try again");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              onChange={handleUserEmail}
              placeholder="Email"
              value={userEmail}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors"
            />
            {error.userEmail && (
              <p className="text-red-600 text-sm mt-1">{error.userEmail}</p>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={handleUserPassword}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e07d6a] hover:border-[#e07d6a] transition-colors pr-10"
            />
            {error.userPassword && (
              <p className="text-red-600 text-sm mt-1">{error.userPassword}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {showPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleLoginSubmission}
              type="submit"
              className="w-full bg-[#e07d6a] hover:bg-[#9c4f3f] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
        <div
          onClick={() => {
            navigate("/forget-password");
          }}
          className="mt-4 ml-4 text-sm text-[#e07d6a] hover:underline">
          Forgot password?
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't Have an Account?{" "}
            <Link to="/signup" className="text-[#e07d6a] hover:underline">
              Signup
            </Link>
          </p>
        </div>
        <div className="mt-6">
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
  );
}
