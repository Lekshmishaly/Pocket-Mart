const productModel = require("../../Models/productModel");

/////////////////////////// add Products ////////////////////
async function addProduct(req, res) {
  try {
    const {
      name,
      description,
      additionalInfo,
      price,
      sizes,
      sleeve,
      images,
      category,
    } = req.body;
    console.log("name::::>", name);

    const isExist = await productModel.findOne({ name });
    if (isExist) {
      return res
        .status(401)
        .json({ success: false, message: "This Product is already Added" });
    }

    const stocks = sizes.reduce((sum, cur) => (sum += cur.stock), 0);

    const productDetails = await productModel.create({
      name,
      description,
      additionalInfo,
      price,
      stocks,
      sizes,
      sleeve,
      images,
      category,
    });

    if (!productDetails) {
      return res
        .status(401)
        .json({ success: false, message: "Unable to add Product" });
    }
    return res.status(201).json({
      success: true,
      message: "Product added Successfully",
      productDetails,
    });
  } catch (error) {
    console.log(error);
  }
}
/////////////////////// fetch Products ///////////////////////////

async function fetchProducts(req, res) {
  try {
    const ProductsData = await productModel.find().populate("category");

    if (ProductsData.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Products found" });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ProductsData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server internal errors" });
  }
}
/////////////////////// product status controlling ///////////////////////////

async function toggleProduct(req, res) {
  try {
    const { _id, isActive } = req.body;

    const updateData = await productModel.findByIdAndUpdate(
      { _id },
      {
        isActive: isActive ? false : true,
      },
      {
        new: true,
      }
    );

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "unable to update, please try again" });
    }
    if (updateData.isActive) {
      return res.status(200).json({ message: "Product enabled", isActive });
    } else {
      return res.status(200).json({ message: "Product disabled" });
    }
  } catch (err) {
    console.log(err);
  }
}

//////////////////////// fectch prodcut by ID ////////////////////////////

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
async function editProduct(req, res) {
  try {
    const { product, images } = req.body;

    if (images) {
      product.images = [...product.images, ...images];
    }
    const id = product._id;
    delete product._id;

    const updateData = await productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updateData) {
      return res
        .status(401)
        .json({ success: false, message: "Error while Editing" });
    }
    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      updateData,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addProduct,
  fetchProducts,
  toggleProduct,
  fetchProduct,
  editProduct,
};
