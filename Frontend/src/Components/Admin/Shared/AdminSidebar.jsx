import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  Grid,
  Users,
  ShoppingCart,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  BadgeIndianRupee,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "@/Redux/Slice/AdminSlice";
import LogoutModal from "./LogoutModal";

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: ListOrdered, label: "Category", href: "/admin/categoriesList" },
    { icon: Grid, label: "Products", href: "/admin/productList" },
    { icon: Users, label: "Customers", href: "/admin/consumersList" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Ticket, label: "Coupon", href: "/admin/coupon" },
    {
      icon: BadgeIndianRupee,
      label: "Sales Report",
      href: "/admin/sales-report",
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: () => setShowLogoutConfirmation(true),
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 right-4 z-30 lg:hidden text-gray-600 bg-white/90 p-2 rounded-md shadow-md"
        onClick={toggleSidebar}>
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={toggleSidebar}></div>
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 bg-white border-r border-gray-200 shadow-lg`}>
        {/* Header with logo */}
        <div className="h-[60px] px-4 flex items-center justify-between border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#e07d6a]"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-[#e07d6a] opacity-70"></div>
            </div>
            <span className="font-semibold text-[16px] md:text-lg">
              Dashboard
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="py-3 h-[calc(100vh-60px)] overflow-y-auto px-2 sm:px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={index}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition ${
                        isActive ? "text-[#e07d6a] bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setIsOpen(false);
                        }
                      }}>
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-[#e07d6a]" : "text-gray-400"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <LogoutModal
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
