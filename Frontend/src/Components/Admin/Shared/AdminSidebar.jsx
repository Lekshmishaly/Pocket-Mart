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
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: ListOrdered,
      label: "Category",
      href: "/admin/categoriesList",
    },
    {
      icon: Grid,
      label: "Products",
      href: "/admin/productList",
    },
    {
      icon: Users,
      label: "Customers",
      href: "/admin/consumersList",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      href: "/admin/orders",
    },

    {
      icon: Ticket,
      label: "Coupon",
      href: "/admin/coupon",
    },
    {
      icon: BadgeIndianRupee,
      label: "Sales Report",
      href: "/admin/sales-report",
    },

    {
      icon: LogOut,
      label: "Logout",
      onClick: () => {
        setShowLogoutConfirmation(true);
      },
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
        className="fixed top-4 right-4 z-20 lg:hidden text-gray-500 hover:text-gray-600"
        onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white border-r border-gray-200`}>
        {/* Header with Logo */}
        <div className="h-[60px] px-4 flex items-center border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#e07d6a]"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-[#e07d6a] opacity-70"></div>
            </div>
            <span className="font-semibold text-lg">Dashboard</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="py-4 h-[calc(100vh-60px)] overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={index}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
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

      {/* Logout Confirmation Popup */}
      {showLogoutConfirmation && (
        <LogoutModal
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
