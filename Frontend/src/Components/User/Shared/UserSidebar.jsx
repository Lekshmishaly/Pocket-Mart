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
    <div className="relative sm:static">
      <nav className="flex overflow-x-auto sm:flex-col sm:space-y-6 space-x-6 sm:space-x-0 sm:overflow-visible px-4 sm:px-0 py-4 sm:py-0 hide-scrollbar-on-idle">
        {[
          { label: "Account", path: "/profile/account" },
          { label: "Saved Items", path: "/profile/saveditems" },
          { label: "Order History", path: "/profile/orderhistory" },
          { label: "Addresses", path: "/profile/addresses" },
          { label: "My Wallet", path: "/profile/wallet" },
          { label: "Coupons", path: "/profile/coupons" },
          { label: "Change Password", path: "/profile/changepassword" },
          { label: "Logout", path: "logout" },
        ].map((item) => (
          <span
            key={item.label}
            onClick={() =>
              item.path === "logout" ? handleUserLogout() : navigate(item.path)
            }
            className={`flex-shrink-0 px-2 cursor-pointer text-[#8b5d4b] transition-all duration-200 text-sm sm:text-base font-Futura-Light whitespace-nowrap
    hover:text-[#6d483a]
    hover:border-b-[0.5px] hover:border-[#6d483a]
    sm:hover:border-none
    ${
      location.pathname === item.path
        ? "font-semibold text-base sm:text-lg"
        : ""
    }`}>
            {item.label}
          </span>
        ))}
      </nav>
      <div className="relative block sm:hidden">
        <div className="absolute left-0 right-0 border-t border-[#e16939]" />
      </div>{" "}
    </div>
  );
}

export default UserSidebar;
