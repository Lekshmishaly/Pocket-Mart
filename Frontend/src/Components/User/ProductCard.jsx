import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
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
      className="group ">
      {/* Product Image Container */}
      <div className="relative aspect-[782/1000] mt-5 mx-4 bg-[#E8E3DE] overflow-hidden">
        {/* Out of Stock Overlay */}
        {product.stocks === 0 && (
          <div className="absolute inset-0 bg-black/50 flex  items-center justify-center z-10">
            <span className="bg-white/70 px-4 py-1 text-sm  text-[#e06332]  font-small mb-4 font-Futura-Light">
              OUT OF STOCK
            </span>
          </div>
        )}{" "}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center "
        />
      </div>
      {/* Out of Stock Overlay */}

      {/* Product Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 ml-4">
            {" "}
            <h3 className="text-[#312f2d] text-[13px] font-thin leading-relaxed font-Futura-Light, sans-serif">
              {product.name}
            </h3>
            {offerDiscountPercentage && product.stocks >= 1 && (
              <span className="bg-[#e07d6a] text-white text-[9px] px-2 py-1 font-thin mt-1.5 font-Futura-Light">
                {offerDiscountPercentage}% off
              </span>
            )}
          </div>

          <div className="text-right mr-4">
            {typeof offerPrice === "number" &&
            offerPrice > 0 &&
            offerPrice < product.price &&
            product.stocks >= 1 ? (
              <p className="text-[#e3703b] text-[13px] font-thin leading-relaxed font-Futura-Light, sans-serif flex items-center justify-end gap-2">
                ₹{Math.round(offerPrice).toFixed(2)}
                <span className="text-gray-500 line-through text-[13px] leading-relaxed">
                  INR {product.price.toFixed(2)}
                </span>
              </p>
            ) : (
              <p className="text-[#93624c] text-[13px] font-thin leading-relaxed font-Futura-Light, sans-serif">
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
