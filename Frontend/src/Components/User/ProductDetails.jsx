import { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SizeSelector from "./Shared/SizeSelector";
import ImageZoom from "./Shared/ImageZoom";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axiosInstance from "@/Utils/AxiosConfig";

export default function ProductDetails({ product, isWishList, setreload }) {
  const userData = useSelector((store) => store.user.userDetails);

  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id;
  const [isExist, setIsExist] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedZoomImage, setSelectedZoomImage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const scrollContainerRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState({});
  const [averageRating, setAverageRating] = useState(0);

  ////////////////////////////////////// handle AddTo Cart ///////////////////////////////

  async function handleAddToCart() {
    if (!selectedSize) {
      return setError({ size: "Please select a size" });
    }

    try {
      const selectedSizeObject = product.sizes.find(
        (s) => s.size === selectedSize
      );
      const stock = selectedSizeObject ? selectedSizeObject.stock : 0;

      const productData = {
        productId: product._id,
        size: selectedSize,
        stock,
        price: product.price,
        qty: 1,
      };

      const response = await axiosInstance.post("/user/addcart/", {
        userId: userData._id,
        product: productData,
      });

      setIsExist(true);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  ////////////////////////////////////// check Cart Status ///////////////////////////////

  async function checkCartStatus() {
    if (!selectedSize) return;

    try {
      const response = await axiosInstance.post("/user/check-cart-status", {
        userId: userData._id,
        productId: product._id,
        size: selectedSize,
      });

      const { exists } = response.data;
      setIsExist(exists);
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  }

  ////////////////////////////////////// fetch Average Rating ///////////////////////////////

  async function fetchAverageRating() {
    try {
      const response = await axiosInstance.get(
        `/user/average-rating/${productId}`
      );

      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  }

  ////////////////////////////////////// handle Wishlist ///////////////////////////////

  async function handleWishlist() {
    try {
      const response = await axiosInstance.post("/user/wishlist", {
        productId: product._id,
        userId: userData._id,
      });
      setreload(true);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error handling wishlist:", error);
    }
  }

  ////////////////////////////////////// handle Remove Wishlist ///////////////////////////////

  async function handleRemoveWishlist() {
    try {
      const response = await axiosInstance.delete(
        `/user/wishlist/${productId}/${userData._id}`
      );
      setreload(true);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error handling remove wishlist:", error);
    }
  }
  useEffect(() => {
    checkCartStatus();
    fetchAverageRating();
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const { scrollTop, clientHeight } = scrollContainerRef.current;
      const index = Math.round(scrollTop / clientHeight);
      setActiveImage(
        Math.min(
          index,
          Array.isArray(product.images) && product.images.length - 1
        )
      );
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedSize, product._id, checkCartStatus]); // Added checkCartStatus to dependencies

  return (
    <div className="min-h-screen bg-[#f4ede3] flex flex-col lg:flex-row">
      {selectedZoomImage && (
        <ImageZoom
          selectedZoomImage={selectedZoomImage}
          setSelectedZoomImage={setSelectedZoomImage}
        />
      )}

      {/* Left side - Scrollable Images */}
      <div
        ref={scrollContainerRef}
        className="w-full lg:w-[60%] h-[60vh] lg:h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {Array.isArray(product.images) &&
          product.images.map((image, index) => (
            <div
              key={index}
              className="h-full w-full snap-start snap-always relative">
              <img
                onClick={() => setSelectedZoomImage(image)}
                src={image || "/placeholder.svg"}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
      </div>

      {/* Mobile Image Navigation */}
      <div className="lg:hidden absolute top-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
        <button
          className="text-[#8b5d4b] hover:opacity-75 transition-opacity pointer-events-auto"
          aria-label="Previous image"
          onClick={() => setActiveImage((prev) => Math.max(0, prev - 1))}>
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          className="text-[#8b5d4b] hover:opacity-75 transition-opacity pointer-events-auto"
          aria-label="Next image"
          onClick={() =>
            setActiveImage((prev) =>
              Math.min(product.images.length - 1, prev + 1)
            )
          }>
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Right side - Product Details */}
      <div className="lg:w-[40%] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 lg:h-screen lg:overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl mb-2 text-[#312f2d] font-thin leading-relaxed font-Futura-Light">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm leading-relaxed font-Futura-Light">
                  INR {product.price * 1.2}
                </span>
                <span className="text-[#8b5d4b] leading-relaxed text-sm font-Futura-Light">
                  INR {product.price}
                </span>
              </div>
            </div>
            <div>
              {isWishList ? (
                <button
                  onClick={() => {
                    handleRemoveWishlist(); // Remove from wishlist
                  }}
                  className="transition-opacity">
                  <Heart className="w-6 h-6 fill-[#733519] text-[#733519]" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleWishlist(); // Add to wishlist
                  }}
                  className="transition-opacity">
                  <Heart className="w-6 h-6 fill-none text-[#733519] stroke-[#733519]" />
                </button>
              )}
            </div>
          </div>

          {/* Average Rating */}
          <div className="flex items-center mt-4 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.round(averageRating)
                      ? "text-[#955238] fill-[#733519]"
                      : "text-[#ffffff]"
                  }`}
                  fill="currentColor"
                  stroke="#733519"
                  strokeWidth="1"
                />
              ))}
            </div>
            <span className="ml-2 text-[#733519] text-sm font-Futura-Light">
              ({averageRating}/5)
            </span>
          </div>

          {/* Size Selector */}
          <div className="mt-8">
            <SizeSelector
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              productId={product._id}
              error={error}
              setError={setError}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={isExist ? () => navigate("/cart") : handleAddToCart}
              className="w-full py-4 font-Futura-Light font-thin text-sm rounded bg-[#955238] hover:bg-[#713d28] text-white transition-colors"
              disabled={product.stocks === 0} // Disable button if out of stock
            >
              {product.stocks === 0
                ? "Out of Stock"
                : isExist
                ? "Go to Cart"
                : "Add to Cart"}
            </button>
            <button
              className="w-full py-4 font-Futura-Light font-thin text-sm bg-[#955238] hover:bg-[#713d28] text-white transition-colors rounded"
              disabled={product.stocks === 0}>
              {product.stocks !== 0 ? "  Buy it now" : "out of stock"}
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-10">
            <p className="text-[#8b5d4b] text-sm font-thin leading-relaxed font-Futura-Light">
              {product.description || ""}
            </p>
          </div>

          {/* Product Details */}
          <div className="mt-8">
            <button
              onClick={() => setToggle(!toggle)}
              className="text-[#8b5d4b] text-thin font-thin leading-relaxed font-Futura-Light flex items-center justify-between w-full">
              <span>Product details</span>
              <span className="font-bold text-lg">{toggle ? "-" : "+"}</span>
            </button>
            {toggle && (
              <div className="mt-4 text-[#8b5d4b] text-sm font-thin leading-relaxed font-Futura-Light">
                {product.additionalInfo || ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
