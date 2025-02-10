import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

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
          <h3 className="text-[#312f2d] mx-4 text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
            {product.name}
          </h3>
          <div className="text-right">
            <p className=" text-[#93624c] text-sm mx-4 font-thin leading-relaxed font-Futura-Light, sans-serif">
              {" "}
              INR {product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Size Options */}
      </div>
    </div>
  );
}

export default ProductCard;
