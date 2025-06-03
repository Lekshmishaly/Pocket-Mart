import axiosInstance from "@/Utils/AxiosConfig";

/////////////////////////////////////// Product offer ////////////////////////////////

export const productOfferApi = async (
  id,
  productName,
  offerName,
  offerValue,
  offerExpiryDate,
  target_type
) => {
  return await axiosInstance.post("/admin/product/offer", {
    id,
    productName,
    offerName,
    offerValue,
    offerExpiryDate,
    target_type,
  });
};

/////////////////////////////////////// Fetch Product Offer  //////////////////////////////////////////////////

export const fetchProductOfferApi = async () => {
  return await axiosInstance.get("/admin/offer/product");
};

///////////////////////////////////////// remove Offer ////////////////////////////////////

export const removeOffer = async (_id) => {
  return await axiosInstance.delete("/admin/offer", { params: { _id } });
};

/////////////////////////////////////// Category offer ////////////////////////////////

export const CategoryOfferApi = async (
  id,
  CategoryName,
  offerName,
  offerValue,
  offerExpiryDate,
  target_type
) => {
  return await axiosInstance.post("/admin/category/offer", {
    id,
    CategoryName,
    offerName,
    offerValue,
    offerExpiryDate,
    target_type,
  });
};

/////////////////////////////////////// Fetch Category Offer  //////////////////////////////////////////////////

export const fetchCategoryOfferApi = async () => {
  return await axiosInstance.get("/admin/offer/category");
};

////////////////////////////////////// product And Category Offer ///////////////////////////////////////////////

export const productAndCategoryOfferApi = async (
  product_id,
  category_id,
  product_price
) => {
  return await axiosInstance.get("/user/offer", {
    params: {
      product_id,
      category_id,
      product_price,
    },
  });
};
