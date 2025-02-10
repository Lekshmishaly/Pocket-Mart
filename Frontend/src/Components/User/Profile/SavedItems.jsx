import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "@/Utils/AxiosConfig";
import { useSelector } from "react-redux";

function SavedItems(isWishList) {
  const userData = useSelector((store) => store.user.userDetails);

  const [products, setProducts] = useState([]);

  ///////////////////////////////// fetch Wishlist ///////////////////////////////

  async function fetchWishlist() {
    try {
      const response = await axiosInstance.get(
        `/user/wishlist/${userData._id}`
      );
      setProducts(response.data.wishlist.items);
      console.log("Fetching DAtaaaaa========>/", response.data.wishlist.items);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4ede3] pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {Array.isArray(products) &&
            products.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#e8e1d8] overflow-hidden">
                  <button
                    className="absolute right-3 top-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    aria-label={`Remove ${product.productId.name}`}>
                    <X className="h-4 w-4 text-[#8b5d4b]" />
                  </button>
                  <img
                    src={product.productId.images[0] || "/placeholder.svg"}
                    alt={product.productId.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-[#93624c] font-[Futura] text-base tracking-wide">
                    {product.productId.name}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </div>
      {Array.isArray().length === 0 && (
        <div className="bg-[#faf5f0] p-6">
          <p className="text-[#8b5d4b] text-sm  text-center font-Futura-Light">
            Please add products in your wishlist to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
export default SavedItems;
