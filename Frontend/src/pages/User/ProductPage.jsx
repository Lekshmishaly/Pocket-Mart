import ProductDetails from "@/Components/User/ProductDetails";
import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  const { id } = useParams();
  const [product, setproduct] = useState({});

  //////////////////////////////// fecth Products /////////////////////////////////

  async function fetchProduct() {
    try {
      const response = await axiosInstance.get(`/user/fetchingproduct/${id}`);
      console.log(response.data.productData);
      setproduct(response.data.productData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        return toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <>
      <Header name={product.name} />
      <ProductDetails product={product} />
      <Footer />
    </>
  );
}

export default ProductPage;
