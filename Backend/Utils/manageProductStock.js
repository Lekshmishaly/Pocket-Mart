const productModel = require("../Models/productModel");

//////////////////////////////////////// manageStock //////////////////////////////////////

async function manageStock(order_items) {
  try {
    console.log("bloooop :::>", order_items);
    for (const item of order_items) {
      const { productId, qty, size } = item;
      const productData = await productModel.findById(productId);

      if (!productData) {
        console.log("product not found");
        continue;
      }

      const sizeIndex = productData.sizes.findIndex((s) => s.size === size);

      if (sizeIndex === -1) {
        console.log("Size not found in product:", size);
        continue;
      }

      const updatedStock = productData.sizes[sizeIndex].stock - qty;

      productData.sizes[sizeIndex].stock = updatedStock;

      await productData.save();
    }
  } catch (error) {
    console.log("Error managing stock:", error);
  }
}

////////////////////////////////////// manage Stock After Cancel //////////////////////////////////

async function manageStockAfterCancel(item) {
  try {
    const { productId, qty, size } = item;
    const productData = await productModel.findById(productId);
    if (!productData) {
      return console.log("Product not found");
    }
    const sizeIndex = productData.sizes.findIndex((s) => s.size === size);
    const updatedStock = productData.sizes[sizeIndex].stock + qty;
    productData.sizes[sizeIndex].stock = updatedStock;
    await productData.save();
  } catch (error) {
    console.log("Error managing stock:", error);
  }
}

module.exports = { manageStock, manageStockAfterCancel };
