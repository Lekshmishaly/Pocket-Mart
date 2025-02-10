import { useEffect, useState } from "react";
import { User, ShoppingBag, Search, Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "sonner";
import { logoutUser } from "@/Redux/Slice/UserSlice";

export default function Header({ name }) {
  const userData = useSelector((store) => store.user.userDetails);
  const isHomePage = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchValue, setSeachValue] = useState("");
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

  function handleSearch() {
    navigate(`/shop-page/${searchValue}`);
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const scrollPercentage =
        (currentScrollY / (scrollHeight - clientHeight)) * 100;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(scrollPercentage > 5);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`w-screen pt-8 px-4 sm:px-8 lg:px-16 z-50 transition-all duration-500  ${
        isVisible && !isHomePage ? "translate-y-0" : ""
      } ${
        isScrolled && !isHomePage
          ? "bg-[#f4ede3] text-black shadow-md fixed top-0 left-0"
          : isHomePage
          ? "bg-[#f4ede3] text-black shadow-md py-5"
          : "bg-transparent text-black fixed top-0 left-0"
      }`}>
      <div className=" mx-1 ">
        <div className="flex justify-between items-start">
          {/* Left side - Logo and Breadcrumbs */}
          <div className="flex flex-col">
            <span
              onClick={() => navigate("/")}
              className="text-2xl font-sm mb-2  text-[#312617de] ">
              𝒫𝑜𝒸𝓀𝑒𝓉 𝑀𝒶𝓇𝓉
            </span>
            <nav className="text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light, sans-serif">
              <span
                onClick={() => navigate("/")}
                className="cursor-pointer text-[#8b5d4b] text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
                Home
              </span>
              <span className="mx-2">|</span>
              <span
                onClick={() => navigate("/shop-page")}
                className="cursor-pointer text-[#8b5d4b] text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
                All
              </span>
              <span className="mx-2">|</span>
              <span className="cursor-pointer text-[#8b5d4b] text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
                {name || ""}
              </span>
            </nav>
          </div>

          {/* Right side - Navigation Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 relative">
            <span
              onClick={() => navigate("/shop-page")}
              className="cursor-pointer text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light, sans-serif hover:text-gray-700 hidden sm:inline-block">
              Sale
            </span>
            {userData ? (
              <>
                {" "}
                <Button
                  onClick={() => navigate("/profile/account")}
                  variant="ghost"
                  size="sm"
                  aria-label="User account">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={() => navigate("/cart")}
                  variant="ghost"
                  size="sm"
                  aria-label="Shopping bag">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>{" "}
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                size="sm"
                aria-label="Login">
                <span
                  onClick={() => navigate("/shop-page")}
                  className="cursor-pointer text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light, sans-serif hover:text-gray-700 hidden sm:inline-block">
                  Login
                </span>
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
              </Button>
            )}

            {isSearchVisible && (
              <input
                onChange={(e) => {
                  setSeachValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                type="text"
                placeholder="Search..."
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b5d4b] transition-all duration-300"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              aria-label="Search"
              onClick={() => setIsSearchVisible(!isSearchVisible)}>
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Menu">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#f4ede3]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <SheetTitle></SheetTitle>
                  <div
                    onClick={() => navigate("/")}
                    className="text-sm text-[#8b5d4b] font-thin leading-relaxed font-Futura-Light, sans-serif  border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
                    Home
                  </div>
                  <div
                    onClick={() => navigate("/shop-page")}
                    className="text-sm text-[#8b5d4b] font-thin leading-relaxed font-Futura-Light, sans-serif  border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
                    All
                  </div>
                  <div
                    onClick={() => navigate("/shop-page")}
                    className="text-sm text-[#8b5d4b] font-thin leading-relaxed font-Futura-Light, sans-serif  border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
                    Shop
                  </div>
                  <div
                    onClick={handleUserLogout}
                    className="text-sm text-[#8b5d4b] font-thin leading-relaxed font-Futura-Light, sans-serif  border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
                    Logout
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
