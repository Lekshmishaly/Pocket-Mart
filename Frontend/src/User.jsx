import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Components/User/Signup";
import Login from "./Components/User/Login";
import ForgetPassword from "./Components/User/forgetPassword";
import ProductPage from "./pages/User/ProductPage";
import ShopPage from "./pages/User/ShopPage";
import HomePage from "./pages/User/HomePage";
import ProtectedUserLogin from "./Private/ProtectedUserLogin";
import ProtectedUserHome from "./Private/ProtectedUserHome";
import UserProfilePage from "./pages/User/UserProfilePage";
import CartPage from "./pages/User/CartPage";
import Header from "./Components/User/Shared/Header";
import Footer from "./Components/User/Shared/Footer";
import CheckOutPage from "./pages/User/CheckOutPage";
import RatingPage from "./Components/User/Shared/RatingPage";

function User() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/login"
        element={
          <ProtectedUserLogin>
            <Login />
          </ProtectedUserLogin>
        }
      />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/" element={<HomePage />} />

      <Route path="/shop-page/:search" element={<ShopPage />} />
      <Route path="/shop-page" element={<ShopPage />} />

      <Route path="/product-Page/:id" element={<ProductPage />} />
      <Route path="/rate/:id" element={<RatingPage />} />
      <Route
        path="/profile/*"
        element={
          <ProtectedUserHome>
            <UserProfilePage />
          </ProtectedUserHome>
        }
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckOutPage />} />
      <Route path="/header" element={<Header />} />
      <Route path="/footer" element={<Footer />} />
    </Routes>
  );
}

export default User;
