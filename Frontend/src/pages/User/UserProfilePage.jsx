import Account from "@/Components/User/Profile/Account";
import AddressManagement from "@/Components/User/Profile/AddressManagement";
import ChangePassword from "@/Components/User/Profile/ChangePassword";
import OrderDetails from "@/Components/User/Profile/OrderDetails";
import OrderHistory from "@/Components/User/Profile/OrderHistory";
import SavedItems from "@/Components/User/Profile/SavedItems";
import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import UserSidebar from "@/Components/User/Shared/UserSidebar";
import Wallet from "@/Components/User/Profile/Wallet";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Coupons from "@/Components/User/Profile/Coupons";
function UserProfilePage() {
  const userData = useSelector((store) => store.user.userDetails);

  return (
    <>
      <Header />
      <div className="bg-[#f4ede3] mt-40">
        {/* Welcome Banner */}
        <header className="bg-[#e8dccd] py-2 px-16 mt-16 h-14 ">
          <h1 className="text-[#8b5d4b] text-sm   mt-3 font-thin ml-12 leading-relaxed font-Futura-Light, sans-serif">
            {`  Hello, ${userData.firstname} ${userData.lastname}. `}
          </h1>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 py-4">
            {/* Sidebar */}
            <div className="w-full md:w-64 md:border-r-[1px] md:border-[#8b5d4b] md:h-full">
              <UserSidebar />
            </div>
            {/* Main Content Area */}
            <div className="flex-1">
              <Routes>
                {/* Define routes relative to /user/profile */}
                <Route path="orderhistory" element={<OrderHistory />} />
                <Route path="account" element={<Account />} />
                <Route path="saveditems" element={<SavedItems />} />
                <Route path="addresses" element={<AddressManagement />} />
                <Route
                  path="orderDetails/:order_id"
                  element={<OrderDetails />}
                />
                <Route path="wallet" element={<Wallet />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="changepassword" element={<ChangePassword />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfilePage;
