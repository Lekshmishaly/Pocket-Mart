const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order_id: {
    type: String,
  },
  order_items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      size: {
        type: String,
        required: true,
      },

      qty: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
      price: {
        type: Number,
        required: true,
      },
      order_status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },

      Delivered_on: {
        type: Date,
      },
      total_price: {
        type: Number,
        required: true,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: true,
    min: [0, "Total amount cannot be negative"],
  },
  shipping_address: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    landMark: { type: String },
    postalCode: { type: Number, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  payment_method: {
    type: String,
    required: true,
    enum: ["Razor Pay", "wallet", "Cash on Delivery"],
    default: "Cash on Delivery",
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  shipping_fee: {
    type: Number,
    required: true,
    min: [0, "Shipping fee cannot be negative"],
  },
  placed_at: {
    type: Date,
    default: Date.now,
  },
  delivery_by: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  if (!this.delivery_by) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days after order placement
    this.delivery_by = deliveryDate;
  }
  next();
});
orderSchema.pre("save", function (next) {
  if (!this.order_id) {
    const uniqueId = `PKM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    this.order_id = uniqueId;
  }
  next();
});
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
