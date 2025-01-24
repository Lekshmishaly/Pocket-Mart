import { logoutUser } from "@/Redux/Slice/UserSlice";
import axiosInstance from "@/Utils/AxiosConfig";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function UserSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleUserLogout() {
    try {
      const response = await axiosInstance.patch("/user/logout");
      toast.success(response.data.message);
      dispatch(logoutUser());
      navigate("/login");
      return;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        return;
      }
      console.log(error);
    }
  }
  return (
    <nav className="space-y-6">
      <span
        onClick={() => navigate("/profile/account")}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        {" "}
        Account
      </span>
      <span
        onClick={() => navigate("/profile/saveditems")}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        Saved Items
      </span>
      <span
        onClick={() => navigate("/profile/orderhistory")}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        {" "}
        Order History
      </span>
      <span
        onClick={() => navigate("/profile/addresses")}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        Addresses
      </span>
      <span
        onClick={() => navigate("/profile/changepassword")}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        Change Password
      </span>
      <span
        onClick={handleUserLogout}
        className="block cursor-pointer text-[#8b5d4b] hover:text-[#6d483a]  hover:border-b-[0.5px] hover:border-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
        Logout
      </span>
    </nav>
  );
}

export default UserSidebar;
