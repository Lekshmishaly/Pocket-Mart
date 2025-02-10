const productModel = require("../../Models/productModel");
const categoryModel = require("../../Models/categoryModel");

//////////////////////////////// fetchProductsHome ////////////////////////

async function fetchProductsHome(req, res) {
  try {
    const { limit } = req.params;
    const limitNumber = parseInt(limit, 10); //Prevents any accidental misinterpretation of the value if limit is passed in an unexpected format

    const latestProducts = await productModel
      .find({ isActive: true })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      message: "Latest products fetched successfully",
      ProductsData: latestProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
}
//////////////////// product fetching  to userSide  ////////////////////////////

async function fetchProducts(req, res) {
  try {
    const { limit = 0 } = req.params;
    const search = req.params.search || "";
    const { filter, sortBy } = req.body;

    console.log("sortBy::", sortBy);
    // Build the search condition
    const searchCondition = search
      ? {
          name: { $regex: `${search}`, $options: "i" },
          isActive: true,
        }
      : { isActive: true };

    // Fetch the category ObjectIds for the provided category names
    let categoryIds = [];
    if (filter.categories?.length > 0) {
      const categories = await categoryModel.find({
        name: { $in: filter.categories },
        isActive: true,
      });
      categoryIds = categories.map((category) => category._id);
    }

    // Build the filter condition
    const filterCondition = {
      ...(categoryIds.length > 0 && { category: { $in: categoryIds } }),
      ...(filter.sleeves?.length > 0 && { sleeve: { $in: filter.sleeves } }),
      ...(filter.price > 0 && { price: { $lte: filter.price } }),
    };

    // defining sorting logic
    let sortCondition = {};
    if (sortBy) {
      switch (sortBy) {
        case "newest":
          sortCondition = { createdAt: -1 }; // Newest products first
          break;
        case "price_asc":
          sortCondition = { price: 1 }; // Low to High
          break;
        case "price_desc":
          sortCondition = { price: -1 }; // High to Low
          break;
        case "name_asc":
          sortCondition = { name: 1 }; // Alphabetical aA - zZ
          break;
        case "name_desc":
          sortCondition = { name: -1 }; // Reverse alphabetical zZ - aA
          break;
        default:
          break;
      }
    }

    // Fetch products with search, filter, and sort conditions
    const ProductsData = await productModel
      .find({ ...searchCondition, ...filterCondition })
      .sort(sortCondition) // Apply sorting here
      .populate({
        path: "category",
        match: { isActive: true },
      })
      .limit(Number(limit));

    //updating Total Stocks
    for (const product of ProductsData) {
      let totalStocks = product.sizes.reduce(
        (acc, size) => acc + size.stock,
        0
      );
      product.stocks = totalStocks;
      await product.save();
    }

    // Filter products with valid categories
    const filteredProducts = ProductsData.filter(
      (product) => product.category !== null
    );

    const maxPriceResult = await productModel.aggregate([
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const maxPrice =
      maxPriceResult.length > 0 ? maxPriceResult[0].maxPrice : null;

    // Respond with the products
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ProductsData: filteredProducts,
      maxPrice,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
}
/////////////////////////////////// frctch product  By ID //////////////////////////////////

async function fetchProduct(req, res) {
  try {
    const { id } = req.params;

    const productData = await productModel.findById(id).populate("category");

    if (!productData) {
      res.status(401).json({ success: false, message: "No Products found" });
    }

    let totalStocks = 0;
    productData.sizes.forEach((s) => {
      totalStocks += s.stock;
    });
    productData.stocks = totalStocks;
    await productData.save();

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
  fetchProductsHome,
};
