import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { CalculateOfferPrice } from "@/Utils/CalculateOfferPrice";

function ProductCard({ product }) {
  // offers

  const [offerPrice, setofferPrice] = useState(0);
  const [offerDiscountAmount, setofferDiscountAmount] = useState(null);
  const [offerDiscountPercentage, setofferDiscountPercentage] = useState(null);
  const navigate = useNavigate();

  ///////////////////////////////////// offers ////////////////////////////////////////////

  async function offers() {
    const offerData = await CalculateOfferPrice(
      product._id,
      product.category,
      product.price
    );
    setofferPrice(offerData.offerPrice);
    setofferDiscountAmount(offerData.offerDiscountAmt);
    setofferDiscountPercentage(offerData.offerDiscount);
  }
  useEffect(() => {
    offers();
  }, []);
  return (
    <div
      onClick={() => {
        navigate(`/product-Page/${product._id}`);
      }}
      key={product.id}
      className="group">
      {/* Product Image Container */}
      <div className="relative w-full aspect-[3/4] mt-5 bg-[#E8E3DE] overflow-hidden">
        {product.stocks === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white/70 px-3 py-0.5 text-[10px] sm:text-xs md:text-sm text-[#e06332] font-Futura-Light mb-4">
              OUT OF STOCK
            </span>
          </div>
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-4 mt-2 ">
        <div className="flex flex-col justify-between gap-1">
          {/* Name & Discount */}
          <div className="flex items-start justify-between">
            <h3 className="text-[#312f2d] text-[13px] font-thin leading-relaxed font-Futura-Light, sans-serif">
              {product.name}
            </h3>
            {offerDiscountPercentage && product.stocks >= 1 && (
              <span className="bg-[#e07d6a] text-white text-[9px] px-2 py-1 font-thin mt-0.5 font-Futura-Light">
                {offerDiscountPercentage}% off
              </span>
            )}
          </div>

          {/* Prices */}
          <div className="text-left">
            {typeof offerPrice === "number" &&
            offerPrice > 0 &&
            offerPrice < product.price &&
            product.stocks >= 1 ? (
              <p className="text-[#e3703b] text-[12px] font-thin leading-relaxed font-Futura-Light, sans-serif flex flex-wrap items-baseline gap-1">
                ₹{Math.round(offerPrice).toFixed(2)}
                <span className="text-gray-700 line-through text-[9px] font-Futura-Light whitespace-nowrap">
                  INR {product.price.toFixed(2)}
                </span>
              </p>
            ) : (
              <p className="text-[#93624c] text-[12px] font-thin leading-relaxed font-Futura-Light, sans-serif">
                INR {product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
