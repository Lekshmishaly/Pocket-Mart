const express = require("express");
const userRoute = express.Router();
const userController = require("../Controllers/User/userController");
const userAuth = require("../Middleware/userAuth");
const rateLimit = require("express-rate-limit");
const productController = require("../Controllers/User/productController");
const addressController = require("../Controllers/User/addressController");
const cartController = require("../Controllers/User/cartController");
const orderController = require("../Controllers/User/OrderController");

// Rate limiter to prevent abuse
const resetPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many password reset attempts, please try again later.",
});

// user controller  Routes
userRoute.post("/sendotp", userController.sendOtp);
userRoute.post("/signup", userAuth.verifyOtp, userController.createUser);
userRoute.post("/login", userController.userLogin);
userRoute.patch("/logout", userController.logout);

userRoute.post(
  "/forget-password",
  resetPasswordLimiter,
  userController.forgetPassword
);

userRoute.post("/verify-otp", userAuth.verifyOtp, (req, res) => {
  res.status(200).json({ success: true, message: "OTP verified successfully" });
});

userRoute.put("/edit", userController.editUser);

userRoute.post(
  "/reset-password",
  resetPasswordLimiter,
  userController.resetPassword
);

userRoute.post("/googleAuth", userController.googleAuth);
userRoute.put("/changepassword", userController.changePassword);

//Product controller routes
userRoute.get("/fetchproductdetails/:limit", productController.fetchProducts);
userRoute.get("/fetchingproduct/:id", productController.fetchProduct);
userRoute.get("/fetchSize/:id", productController.fetchSize);

//Adress controller routes
userRoute.post("/address", addressController.addAddress);
userRoute.get("/addresses/:userId", addressController.fetchAddress);
userRoute.delete("/address/:id", addressController.deleteAddress);
userRoute.put("/address/edit", addressController.editAddress);

//Cart controller routes
userRoute.post("/addcart", cartController.addToCart);
userRoute.post("/check-cart-status", cartController.checkCartStatus);
userRoute.get("/cart/:id", cartController.fetchCart);
userRoute.delete("/cart/:product_id/:user_id", cartController.removeCartItem);
userRoute.patch("/cart/min/:product_id/:user_id", cartController.minusCartItem);
userRoute.patch("/cart/add/:product_id/:user_id", cartController.plusCartItem);
userRoute.put("/cart/remove-items", cartController.removeOrderItems);

//Order controller routes
userRoute.post("/order", orderController.addOrder);
userRoute.get("/cart/checkout/:id", orderController.fetchCartToCheckout);
userRoute.get("/fetchorders/:userId", orderController.fetchOrders);
userRoute.get("/fetchorder/:order_id", orderController.fetchOrder);
userRoute.patch("/order/cancel", orderController.orderCancel);
module.exports = userRoute;
