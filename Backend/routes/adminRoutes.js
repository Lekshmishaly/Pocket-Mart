const express = require("express");
const adminRoute = express.Router();
//imports
const adminController = require("../Controllers/Admin/adminController");
const categoryController = require("../Controllers/Admin/categoryController");
const productController = require("../Controllers/Admin/productController");
const userController = require("../Controllers/Admin/userController");
const orderController = require("../Controllers/Admin/orderController");
//...........ROUTES................

const adminAuth = require("../Middleware/adminAuth");

//admin controller routes
adminRoute.get("/createadmin/:email", adminController.createAdmin);
adminRoute.post("/login", adminController.login);

//catagory controller routes
adminRoute.post(
  "/category",
  adminAuth.jwtVerification,
  categoryController.addCategory
);
adminRoute.get(
  "/categories",
  adminAuth.jwtVerification,
  categoryController.fetchCategories
);
adminRoute.patch(
  "/category/toogle-status",
  adminAuth.jwtVerification,
  categoryController.toggleCategory
);
adminRoute.get(
  "/category/:id",
  adminAuth.jwtVerification,
  categoryController.fetchCategory
);
adminRoute.put(
  "/editcategory",
  adminAuth.jwtVerification,
  categoryController.editCategory
);

//product controller routes
adminRoute.post(
  "/addproduct",
  adminAuth.jwtVerification,
  productController.addProduct
);
adminRoute.get(
  "/products",
  adminAuth.jwtVerification,
  productController.fetchProducts
);
adminRoute.get(
  "/product/:id",
  adminAuth.jwtVerification,
  productController.fetchProduct
);
adminRoute.patch(
  "/product/toogle-status",
  adminAuth.jwtVerification,
  productController.toggleProduct
);
adminRoute.put(
  "/product",
  adminAuth.jwtVerification,
  productController.editProduct
);

//user controller routes
adminRoute.get(
  "/customerList",
  adminAuth.jwtVerification,
  userController.ConsumerList
);
adminRoute.patch(
  "/customer/toogle-status",
  adminAuth.jwtVerification,
  userController.toggleConsumer
);

//Order controller routes

adminRoute.get("/order", orderController.fetchOrder);
adminRoute.put("/order/status", orderController.changeStatus);
module.exports = adminRoute;
