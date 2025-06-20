import { productAndCategoryOfferApi } from "@/APIs/Products/Offers";

export async function CalculateOfferPrice(
  product_id,
  category_id,
  product_price
) {
  try {
    const response = await productAndCategoryOfferApi(
      product_id,
      category_id,
      product_price
    );

    // Offers in percentage
    const productOfferPercentage = response.data.productOffer || 0;
    const categoryOfferPercentage = response.data.categoryOffer || 0;

    // Calculate discount amounts based on percentages
    const productDiscountAmount =
      (product_price * productOfferPercentage) / 100;
    const categoryDiscountAmount =
      (product_price * categoryOfferPercentage) / 100;

    const offerData = {
      offerPrice: product_price,
      offerDiscountAmt: null,
      offerDiscount: null,
    };

    // Determine the highest discount and set values in offerData
    if (categoryDiscountAmount > productDiscountAmount) {
      offerData.offerPrice = product_price - categoryDiscountAmount;

      offerData.offerDiscountAmt = categoryDiscountAmount;
      offerData.offerDiscount = categoryOfferPercentage;
    } else if (productDiscountAmount > categoryDiscountAmount) {
      offerData.offerPrice = product_price - productDiscountAmount;

      offerData.offerDiscountAmt = productDiscountAmount;
      offerData.offerDiscount = productOfferPercentage;
    }

    return offerData;
  } catch (error) {
    console.log(error);
    // Return a consistent response on error

    return {
      offerPrice: product_price,
      offerDiscountAmt: null,
      offerDiscount: null,
    };
  }
}
