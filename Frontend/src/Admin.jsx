import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import Login from "./Components/Admin/Login";
import {
  ProductManagement,
  DashboardSkeleton,
  EditCategorySkeleton,
  CategorySkeleton,
} from "./Components/ui/Skeletons";

//Lazy Load Pages
const Dashboard = lazy(() => import("./Components/Admin/Dashboard"));
const AddCategory = lazy(() =>
  import("./Components/Admin/Category/AddCategory")
);
const CategoriesList = lazy(() =>
  import("./Components/Admin/Category/CategoriesList")
);
const EditCategory = lazy(() =>
  import("./Components/Admin/Category/EditCategory")
);
const AdminSidebar = lazy(() =>
  import("./Components/Admin/Shared/AdminSidebar")
);
const AddProduct = lazy(() => import("./Components/Admin/Products/AddProduct"));
const ProductList = lazy(() =>
  import("./Components/Admin/Products/ProductList")
);
const EditProduct = lazy(() =>
  import("./Components/Admin/Products/EditProduct")
);
const ConsumersList = lazy(() => import("./Components/Admin/ConsumersList"));
const ProtectedAdminHome = lazy(() => import("./Private/ProtectedAdminHome"));
const OrdersList = lazy(() => import("./Components/Admin/Order/OrdersList"));
const ProductOffer = lazy(() =>
  import("./Components/Admin/Offer/ProductOffer")
);
const CategoryOffer = lazy(() =>
  import("./Components/Admin/Offer/CategoryOffer")
);
const Coupons = lazy(() => import("./Components/Admin/Coupons/Coupons"));
const AddCoupon = lazy(() => import("./Components/Admin/Coupons/AddCoupon"));
const SalesReport = lazy(() => import("./Components/Admin/SalesReport"));

function Admin() {
  return (
    <Provider store={store}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className=" lg:w-64 lg:fixed lg:h-full">
          <AdminSidebar />
        </div>
        <div className="flex-grow lg:ml-64 p-2 md:p-6 overflow-y-auto ">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedAdminHome>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedAdminHome>
              }
            />
            {/* categories  */}
            <Route
              path="/add-category"
              element={
                <ProtectedAdminHome>
                  <AddCategory />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/categoriesList"
              element={
                <Suspense fallback={<CategorySkeleton />}>
                  <CategoriesList />
                </Suspense>
              }
            />
            <Route
              path="/edit-categories/:id"
              element={
                <Suspense fallback={<EditCategorySkeleton />}>
                  <EditCategory />
                </Suspense>
              }
            />

            {/* products  */}
            <Route
              path="/add-product"
              element={
                <Suspense fallback={<EditCategorySkeleton />}>
                  <AddProduct />
                </Suspense>
              }
            />
            <Route
              path="/productList"
              element={
                <Suspense fallback={<ProductManagement />}>
                  <ProductList />
                </Suspense>
              }
            />
            <Route
              path="/edit-product/:id"
              element={
                <Suspense fallback={<EditCategorySkeleton />}>
                  <EditProduct />
                </Suspense>
              }
            />

            {/* consumersList */}
            <Route
              path="consumersList"
              element={
                <Suspense fallback={<CategorySkeleton />}>
                  <ConsumersList />
                </Suspense>
              }
            />

            {/* Order  */}
            <Route
              path="orders"
              element={
                <Suspense fallback={<CategorySkeleton />}>
                  <OrdersList />
                </Suspense>
              }
            />

            {/* Offer */}
            <Route
              path="product-offer/:id/:productName"
              element={
                <ProtectedAdminHome>
                  <ProductOffer />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="category-offer/:id/:categoryName"
              element={
                <ProtectedAdminHome>
                  <CategoryOffer />
                </ProtectedAdminHome>
              }
            />
            {/* Coupens */}
            <Route
              path="/coupon"
              element={
                <ProtectedAdminHome>
                  <Coupons />
                </ProtectedAdminHome>
              }
            />
            <Route
              path="/addcoupon"
              element={
                <ProtectedAdminHome>
                  <AddCoupon />
                </ProtectedAdminHome>
              }
            />
            {/* Sales-Report */}
            <Route
              path="/sales-report"
              element={
                <ProtectedAdminHome>
                  <Suspense fallback={<CategorySkeleton />}>
                    <SalesReport />
                  </Suspense>
                </ProtectedAdminHome>
              }
            />
          </Routes>
        </div>
      </div>
    </Provider>
  );
}

export default Admin;
