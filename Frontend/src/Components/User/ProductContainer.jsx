import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { PackageX } from "lucide-react";

function ProductContainer({ title }) {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    try {
      const limit = 6;
      const response = await axiosInstance.get(`/user/product/home/${limit}`);
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
    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <h2 className="text-[#8b5d4b] text-sm leading-relaxed font-extrabold text-center">
        {title}
      </h2>

      <div
        className="grid 
               grid-cols-2 
               sm:grid-cols-2 
               md:grid-cols-2 
               lg:grid-cols-3 
               xl:grid-cols-3 
               gap-x-6 gap-y-10
               px-2 sm:px-4 md:px-6 xl:px-12
               py-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg">
            <PackageX
              className="w-12 h-12 mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            Product not found
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductContainer;
