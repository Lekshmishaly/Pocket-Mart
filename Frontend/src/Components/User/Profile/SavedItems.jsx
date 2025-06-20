import React, { useEffect, useState } from "react";
import { PackageX, X } from "lucide-react";
import axiosInstance from "@/Utils/AxiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SavedItems() {
  const userData = useSelector((store) => store.user.userDetails);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  ///////////////////////////////// fetch Wishlist ///////////////////////////////

  async function fetchWishlist() {
    try {
      const response = await axiosInstance.get(
        `/user/wishlist/${userData._id}`
      );
      setProducts(response.data.wishlist.items);
    } catch (error) {
      console.log(error);
    }
  }

  ////////////////////////////////////// handle Remove Wishlist ///////////////////////////////

  async function handleRemoveWishlist(productId) {
    try {
      const response = await axiosInstance.delete(
        `/user/wishlist/${productId}/${userData._id}`
      );
      setReload(true);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error handling remove wishlist:", error);
    }
  }

  useEffect(() => {
    fetchWishlist();
    setReload(false);
  }, [reload]);

  return (
    <div className="min-h-screen bg-[#f4ede3] pt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-[#8b5d4b] text-xl mb-8 font-light">Wishlist</h2>

      <div className="max-w-[2000px] mx-auto">
        {/* Updated responsive grid classes */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="group relative">
                <div
                  className="relative aspect-[3/4] bg-[#e8e1d8] overflow-hidden cursor-pointer"
                  onClick={() =>
                    navigate(`/product-Page/${product.productId._id}`)
                  }>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWishlist(product.productId._id);
                    }}
                    className="absolute right-2 top-2 z-10 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    aria-label={`Remove ${product.productId.name}`}>
                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-[#8b5d4b]" />
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
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg">
              <PackageX
                className="w-12 h-12 mb-4 text-muted-foreground"
                aria-hidden="true"
              />
              Please add products to your wishlist to see them here.{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedItems;
