import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function ProductContainer({ title }) {
  const limit = 6;
  const [products, setProducts] = useState([]);

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
    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 mt-5  m-0">
      <h2 className="text-[#8b5d4b] text-sm leading-relaxed font-extrabold text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-x-32 2xl:gap-8 m-12">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductContainer;
