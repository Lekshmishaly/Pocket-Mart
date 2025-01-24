const Order = require("../../Models/orderModel");

////////////////////////////// fetch Order //////////////////////////////

async function fetchOrder(req, res) {
  try {
    const orderData = await Order.find().populate({
      path: "order_items.productId",
    });

    // console.log("orderData:::::::::::::::::::::::::", orderData);

    if (!orderData) {
      return res
        .status(400)
        .json({ message: "Orders not Found", success: false });
    }

    return res.status(200).json({
      success: true,
      message: "All Orders Fetch successfully",
      orderData,
    });
  } catch (error) {
    console.error("Error in  Order Fecth:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while  Order fecthing",
    });
  }
}

////////////////////////////// Change Status //////////////////////////////

async function changeStatus(req, res) {
  try {
    const { orderId, itemId, newStatus } = req.body;
    const order_id = orderId.toString();

    const order = await Order.findOne({ order_id });

    if (!order) {
      return res
        .status(401)
        .json({ success: false, message: "Order not Found" });
    }

    order.order_items.forEach((item) => {
      if (item._id.toString() === itemId && item.order_status !== newStatus) {
        item.order_status = newStatus;
      }
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error in Change Status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing the status",
    });
  }
}
module.exports = {
  fetchOrder,
  changeStatus,
};
