import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedUserHome from "./Private/ProtectedUserHome";
import ProtectedUserLogin from "./Private/ProtectedUserLogin";
import {
  CheckoutSkeleton,
  FooterSkeleton,
  HeaderSkeleton,
  HomeSkeleton,
  ProductSkeleton,
} from "./Components/ui/Skeletons";

//Lazy Load Pages
const Signup = lazy(() => import("./Components/User/Signup"));
const Login = lazy(() => import("./Components/User/Login"));
const ForgetPassword = lazy(() => import("./Components/User/forgetPassword"));
const ProductPage = lazy(() => import("./pages/User/ProductPage"));
const ShopPage = lazy(() => import("./pages/User/ShopPage"));
const HomePage = lazy(() => import("./pages/User/HomePage"));
const UserProfilePage = lazy(() => import("./pages/User/UserProfilePage"));
const CartPage = lazy(() => import("./pages/User/CartPage"));
const Header = lazy(() => import("./Components/User/Shared/Header"));
const Footer = lazy(() => import("./Components/User/Shared/Footer"));
const CheckOutPage = lazy(() => import("./pages/User/CheckOutPage"));
const RatingPage = lazy(() => import("./Components/User/Shared/RatingPage"));
const NotFoundPage = lazy(() => import("./Utils/NotFoundPage"));

function User() {
  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <Suspense fallback={<CheckoutSkeleton />}>
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedUserLogin>
            <Suspense fallback={<CheckoutSkeleton />}>
              <Login />
            </Suspense>
          </ProtectedUserLogin>
        }
      />
      <Route
        path="/forget-password"
        element={
          <Suspense fallback={<CheckoutSkeleton />}>
            <ForgetPassword />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          <Suspense fallback={<HomeSkeleton />}>
            <HomePage />
          </Suspense>
        }
      />

      <Route
        path="/shop-page/:search"
        element={
          <Suspense fallback={<ProductSkeleton />}>
            <ShopPage />
          </Suspense>
        }
      />
      <Route
        path="/shop-page"
        element={
          <Suspense fallback={<ProductSkeleton />}>
            <ShopPage />
          </Suspense>
        }
      />

      <Route
        path="/product-Page/:id"
        element={
          <Suspense fallback={<ProductSkeleton />}>
            <ProductPage />
          </Suspense>
        }
      />
      <Route
        path="/rate/:id"
        element={
          <Suspense fallback={<ProductSkeleton />}>
            <RatingPage />
          </Suspense>
        }
      />
      <Route
        path="/profile/*"
        element={
          <ProtectedUserHome>
            <Suspense fallback={<CheckoutSkeleton />}>
              <UserProfilePage />
            </Suspense>
          </ProtectedUserHome>
        }
      />
      <Route
        path="/cart"
        element={
          <Suspense fallback={<CheckoutSkeleton />}>
            <CartPage />
          </Suspense>
        }
      />
      <Route
        path="/checkout"
        element={
          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckOutPage />
          </Suspense>
        }
      />
      <Route
        path="/header"
        element={
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
        }
      />
      <Route
        path="/footer"
        element={
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
        }
      />

      <Route
        path="*"
        element={
          <Suspense fallback={<CheckoutSkeleton />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default User;
