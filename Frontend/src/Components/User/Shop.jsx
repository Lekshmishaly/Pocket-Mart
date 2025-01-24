import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "@/Utils/AxiosConfig";

// Import product images

export default function Shop() {
  const [products, setProducts] = useState([]);

  const limit = 0;
  async function fetchProducts() {
    try {
      const response = await axiosInstance.get(
        `/user/fetchproductdetails/${limit}`
      );
      setProducts(response.data.ProductsData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        return console.log(error.response.data.message);
      }
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 mt-32 pb-7 bg-[#f4ede3]">
      {/* Header */}
      <div className="flex justify-between items-center py-6">
        <button className="flex items-center text-gray-800 hover:text-gray-600">
          <span className="mr-2">FILTER</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button className="flex items-center text-gray-800 hover:text-gray-600">
          <span className="mr-2">SORT BY</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-x-32 2xl:gap-8 mx-12 mt-12">
        {Array.isArray(products) &&
          products.map((product) => <ProductCard product={product} />)}
      </div>
    </div>
  );
}
