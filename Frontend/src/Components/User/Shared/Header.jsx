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
      className={`w-screen pt-6 px-2 sm:px-8 lg:px-16 z-50 transition-all duration-500 ${
        isVisible && !isHomePage ? "translate-y-0" : ""
      } ${
        isScrolled && !isHomePage
          ? "bg-[#f4ede3] text-black shadow-md fixed top-0 left-0"
          : isHomePage
          ? "bg-[#f4ede3] text-black shadow-md py-5"
          : "bg-transparent text-black fixed top-0 left-0"
      }`}>
      <div className="mx-1">
        <div className="flex flex-wrap justify-between items-start gap-y-2 sm:gap-y-0">
          {/* Left - Logo and Breadcrumbs */}
          <div className="flex flex-col min-w-[160px] flex-1 sm:flex-none">
            <span
              onClick={() => navigate("/")}
              className="text-xl lg:text-lg sm:text-sm xs:text-xs max-[320px]:text-[10px] font-sm mb-1 text-[#312617de]">
              𝒫𝑜𝒸𝓀𝑒𝓉 𝑀𝒶𝓇𝓉
            </span>

            <nav className="text-sm lg:text-xs sm:text-[11px] xs:text-[10px] max-[320px]:text-[8.5px] text-[#312f2d] font-thin leading-tight max-[320px]:leading-none">
              <span
                onClick={() => navigate("/")}
                className="cursor-pointer text-[#8b5d4b] font-thin">
                Home
              </span>
              <span className="mx-1 max-[320px]:mx-[4px]">|</span>
              <span
                onClick={() => navigate("/shop-page")}
                className="cursor-pointer text-[#8b5d4b] font-thin">
                All
              </span>
              <span className="mx-1 max-[320px]:mx-[4px]">|</span>
              <span
                onClick={() => navigate("/shop-page")}
                className="cursor-pointer text-[#8b5d4b] font-thin">
                {name || ""}
              </span>
            </nav>
          </div>

          {/* Right - Icons */}
          <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-4 flex-1 sm:flex-none relative max-[320px]:gap-1">
            <span
              onClick={() => navigate("/shop-page")}
              className="cursor-pointer text-sm lg:text-xs sm:text-[11px] xs:text-[10px] max-[320px]:text-[8.5px] text-[#2d2b28] font-thin hover:text-gray-700 hidden sm:inline-block">
              Sale
            </span>

            {userData ? (
              <>
                <Button
                  onClick={() => navigate("/profile/account")}
                  variant="ghost"
                  size="sm"
                  aria-label="User account"
                  className="p-1 sm:p-[6px] max-[400px]:p-[4px] max-[320px]:p-[2px] text-[#925f2d]">
                  <User className="h-5 w-5 sm:h-4 sm:w-4 max-[400px]:h-[13px] max-[400px]:w-[13px] max-[320px]:h-[11px] max-[320px]:w-[11px]" />
                </Button>

                <Button
                  onClick={() => navigate("/cart")}
                  variant="ghost"
                  size="sm"
                  aria-label="Shopping bag"
                  className="p-1 sm:p-[6px] max-[400px]:p-[4px] max-[320px]:p-[2px] text-[#925f2d]">
                  <ShoppingBag className="h-5 w-5 sm:h-4 sm:w-4 max-[400px]:h-[13px] max-[400px]:w-[13px] max-[320px]:h-[11px] max-[320px]:w-[11px]" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                size="sm"
                aria-label="Login"
                className="p-1 sm:p-[6px] max-[400px]:p-[4px] max-[320px]:p-[2px] text-[#794d20]">
                <span className="text-xs sm:text-[11px] max-[400px]:text-[9px] max-[320px]:text-[7.5px] text-[#312f2d] hidden sm:inline-block">
                  Login
                </span>
                <LogIn className="h-5 w-5 sm:h-4 sm:w-4 max-[400px]:h-[13px] max-[400px]:w-[13px] max-[320px]:h-[11px] max-[320px]:w-[11px]" />
              </Button>
            )}

            {isSearchVisible && (
              <input
                onChange={(e) => setSeachValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                type="text"
                placeholder="Search..."
                className="px-2 py-1 text-xs sm:text-[11px] max-[400px]:text-[9px] max-[320px]:text-[7.5px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b5d4b] transition-all duration-300"
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              aria-label="Search"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-1 sm:p-[6px] max-[400px]:p-[4px] max-[320px]:p-[2px] text-[#925f2d]">
              <Search className="h-5 w-5 sm:h-4 sm:w-4 max-[400px]:h-[13px] max-[400px]:w-[13px] max-[320px]:h-[11px] max-[320px]:w-[11px]" />
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Menu"
                  className="p-1 sm:p-[6px] max-[400px]:p-[4px] max-[320px]:p-[2px] text-[#925f2d]">
                  <Menu className="h-5 w-5 sm:h-4 sm:w-4 max-[400px]:h-[13px] max-[400px]:w-[13px] max-[320px]:h-[11px] max-[320px]:w-[11px]" />
                </Button>
              </SheetTrigger>

              <SheetContent className="bg-[#f4ede3]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <SheetTitle></SheetTitle>

                  {["Home", "All", "Shop"].map((label, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(label === "Home" ? "/" : "/shop-page")
                      }
                      className="text-sm sm:text-xs max-[400px]:text-[9px] max-[320px]:text-[7.5px] text-[#8b5d4b] font-thin border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
                      {label}
                    </div>
                  ))}

                  <div
                    onClick={handleUserLogout}
                    className="text-sm sm:text-xs max-[400px]:text-[9px] max-[320px]:text-[7.5px] text-[#8b5d4b] font-thin border-b-2 border-transparent hover:border-[#8b5d4b] transition-colors duration-300">
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
