import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import videoLogo from "../../assets/POCKET.mp4";
import axiosInstance from "../../Utils/AxiosConfig";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addAdmin } from "../../Redux/Slice/AdminSlice";

function Login() {
  const userData = useSelector((store) => store.admin.adminDetails);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      dispatch(addAdmin(response.data.adminData));
      navigate("/admin/dashboard");
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <style jsx global>{`
        input:focus {
          box-shadow: none !important;
          border-color: #e07d6a !important;
        }
      `}</style>
      <div className="w-full max-w-md space-y-8 bg-[#f5f5f5] rounded-lg border border-[#f5f5f5] p-8">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Pocket Mart</h1>
          <h2 className="text-2xl font-semibold mt-4 mb-6 text-gray-700">
            Admin Log In
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#e07d6a] rounded-md focus:outline-none focus:ring-0 focus:border-[#e07d6a] hover:border-[#e07d6a] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-3 py-2 border border-[#e07d6a] rounded-md focus:outline-none focus:ring-0 focus:border-[#e07d6a] hover:border-[#e07d6a] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#e07d6a] hover:bg-[#9c4f3f] text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9c4f3f] focus:ring-opacity-50">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
