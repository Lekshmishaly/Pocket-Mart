const productModel = require("../../Models/productModel");
// const { param } = require("../../routes/userRoutes");

/////// product fetching  to userSlide//////////

async function fetchProducts(req, res) {
  try {
    const { limit } = req.params || 0;
    const ProductsData = await productModel
      .find({ isActive: true })
      .populate({
        path: "category",
        match: { isActive: true },
      })
      .limit(limit);

    const filteredProducts = ProductsData.filter(
      (product) => product.category !== null
    );

    if (filteredProducts.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Products found" });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ProductsData: filteredProducts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server internal errors" });
  }
}
////////////////// frctch product  By ID /////////////////////

async function fetchProduct(req, res) {
  try {
    const { id } = req.params;

    const productData = await productModel.findById(id).populate("category");

    if (!productData) {
      res.status(401).json({ success: false, message: "No Products found" });
    }

    res.status(200).json({
      success: true,
      message: "category fetched successfully",
      productData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server internal errors" });
  }
}
async function fetchSize(req, res) {
  try {
    const { id } = req.params;

    const prodcutData = await productModel.findById({ _id: id });
    const sizeData = prodcutData.sizes;
    if (!sizeData) {
      return res
        .status(401)
        .json({ success: false, message: "Error while fetching size data" });
    }
    return res.status(200).json({ success: true, sizeData });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  fetchProducts,
  fetchProduct,
  fetchSize,
};
