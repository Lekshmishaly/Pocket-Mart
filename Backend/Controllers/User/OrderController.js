const Order = require("../../Models/orderModel");
const Cart = require("../../Models/cartModel");
const {
  manageStock,
  manageStockAfterCancel,
} = require("../../Utils/manageProductStock");

////////////////////////////////// create Order //////////////////////////////

async function addOrder(req, res) {
  try {
    const {
      user,
      cartItems,
      total_amount,
      shipping_address,
      payment_method,
      payment_status,
    } = req.body;

    const products = [];

    //creating product Array

    cartItems.forEach((item) => {
      if (item.qty >= 1) {
        products.push({
          productId: item.productId._id,
          qty: item.qty,
          size: item.size,
          price: item.price,
          payment_status,
          total_price: item.totalProductPrice,
        });
      }
    });

    //creating order collection document
    const order = await Order.create({
      user,
      order_items: products,
      order_status: "pending",
      total_amount: total_amount,
      shipping_address,
      payment_method,
      shipping_fee: 0,
    });
    console.log("Order>>>>>>>>>>>:", order);

    await order.save();

    manageStock(products);

    return res
      .status(200)
      .json({ success: true, message: "Order Placed", order });
  } catch (error) {
    console.error("Error in Order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while placing the order.",
    });
  }
}

/////////////////////////////////////// fetch Cart To Checkout /////////////////////////////

async function fetchCartToCheckout(req, res) {
  try {
    const userId = req.params.id;

    // Find the user cart and populate the product details
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.productId",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "No cart found",
        cartItems: { items: [], totalCartValue: 0 },
      });
    }
    // Recalculating stocks in each fetching
    cart.items.forEach((item) => {
      const sizeData = item.productId.sizes.find((s) => s.size === item.size);
      if (sizeData) {
        item.stock = sizeData.stock;
      }
    });

    //Recalculate qty by new stock
    cart.items.forEach((item) => {
      if (item.qty >= item.stock) {
        item.qty = item.stock;
      } else if (item.qty == 0 && item.stock > 0) {
        item.qty = 1;
      }
    });

    // Recalculate totalProductPrice
    cart.items.forEach((item) => {
      item.totalProductPrice = item.price * item.qty;
    });

    // Filter out inactive products
    cart.items = cart.items.filter((item) => item.productId?.isActive);
    cart.totalCartValue = cart.items.reduce(
      (total, item) => total + item.totalProductPrice,
      0
    );
    cart.items;
    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      cartItems: {
        items: cart.items,
        totalCartValue: cart.totalCartValue,
      },
    });
  } catch (error) {
    console.error("Error in Fetch Cart:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching cart items",
    });
  }
}

////////////////////////////////////// fetch Orders //////////////////////////////////

async function fetchOrders(req, res) {
  try {
    const { userId } = req.params;

    const orderDetails = await Order.find({ user: userId }).sort({
      placed_at: -1,
    });

    if (!orderDetails) {
      return res.status(401).json({
        success: false,
        message: "Orders not Found",
      });
    }
    // console.log("Orders Details", orderDetails);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orderDetails,
    });
  } catch (error) {
    console.error("Error in Fetch Orders:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching Orders",
    });
  }
}

///////////////////////////////////// fetch Order //////////////////////////////////

async function fetchOrder(req, res) {
  try {
    const { order_id } = req.params;

    const orderData = await Order.findOne({ order_id: order_id }).populate({
      path: "order_items.productId", // Path to populate
    });

    if (!orderData) {
      return res.status(401).json({
        success: false,
        message: "Order not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      orderData,
    });
  } catch (error) {
    console.error("Error in Fetch Order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching Order",
    });
  }
}

///////////////////////////////////// order Cancel //////////////////////////////////

async function orderCancel(req, res) {
  try {
    const { order_id, itemId } = req.body;

    console.log("order_id, itemId:::::::kitti", req.body);

    const order = await Order.findOne({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.order_items.forEach((item) => {
      if (item._id.toString() === itemId && item.order_status === "Pending") {
        item.order_status = "Cancelled";
        manageStockAfterCancel(item);
      }
    });

    await order.save();

    manageStockAfterCancel(order.order_items);

    return res
      .status(200)
      .json({ message: "Order item cancelled successfully", order });
  } catch (error) {
    console.error("Error in  Order Cancelling:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while  Order Cancelling",
    });
  }
}

module.exports = {
  addOrder,
  fetchCartToCheckout,
  fetchOrders,
  fetchOrder,
  orderCancel,
};
