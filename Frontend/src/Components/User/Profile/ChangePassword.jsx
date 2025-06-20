import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "sonner";
import { logoutUser } from "@/Redux/Slice/UserSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((store) => store.user.userDetails);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  async function handleChangePassword() {
    try {
      if (!currentPassword) {
        return toast.error("Current password is required.");
      }
      if (newPassword !== confirmPassword) {
        return toast.error("Confirm password does not match.");
      }

      const response = await axiosInstance.put("/user/changepassword", {
        userId: userData._id,
        currentPassword,
        newPassword,
      });

      toast.success(response.data.message);
      dispatch(logoutUser());
      return navigate("/login");
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
    }
  }

  const EyeIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="text-[#8b5d4b] text-medium font-Futura-Light max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl mb-6">Change Password</h2>
      <div className="space-y-6">
        <div className="relative">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full px-3 py-2 pr-10 border bg-[#e8dccd] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e07d6a] border-[#e07d6a]"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showCurrentPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              placeholder="New password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-3 py-2 pr-10 border bg-[#e8dccd] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e07d6a] border-[#e07d6a]"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showNewPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
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
            className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-3 py-2 pr-10 border bg-[#e8dccd] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e07d6a] border-[#e07d6a]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showConfirmPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full sm:w-auto px-6 py-4 font-Futura-Light font-thin text-sm bg-[#a5421b] hover:bg-[#91492d] text-white transition-colors rounded focus:outline-none focus:ring-2 focus:ring-[#a5421b] focus:ring-offset-2">
          Save New Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
