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
      className="group">
      {/* Product Image Container */}
      <div className="relative aspect-[2/3] mb-4 bg-[#E8E3DE] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center "
        />
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-[#312f2d] text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
            {product.name}
          </h3>
          <div className="text-right">
            <p className=" text-[#93624c] text-sm font-thin leading-relaxed font-Futura-Light, sans-serif">
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
