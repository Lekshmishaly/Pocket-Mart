import ProductDetails from "@/Components/User/ProductDetails";
import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import RatingPage from "@/Components/User/Shared/RatingPage";
import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  const userData = useSelector((store) => store.user.userDetails); // Ensure userDetails is properly populated
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isWishList, setIsWishList] = useState(false);
  const [reload, setreload] = useState(false);

  //////////////////////////////// Fetch Product /////////////////////////////////

  async function fetchProduct() {
    try {
      const response = await axiosInstance.get(`/user/fetchingproduct/${id}`);
      setProduct(response.data.productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(error.response?.data?.message || "Failed to fetch product");
    }
  }

  //////////////////////////////// Check Wishlist /////////////////////////////////

  async function checkIsInWishList() {
    try {
      const response = await axiosInstance.get(
        `/user/wishlist/${id}/${userData._id}`
      );

      setIsWishList(response.data.wishlistValue);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }

  //////////////////////////////// Lifecycle Hook /////////////////////////////////

  useEffect(() => {
    fetchProduct();
    checkIsInWishList();
    setreload(false);
  }, [reload]);

  return (
    <>
      <Header name={product?.name} />
      <ProductDetails
        product={product}
        isWishList={isWishList}
        setreload={setreload}
      />
      <RatingPage />
      <Footer />
    </>
  );
}

export default ProductPage;
