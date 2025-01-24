import React from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import Login from "./Components/Admin/Login";
import Dashboard from "./Components/Admin/Dashboard";
import AddCategory from "./Components/Admin/Category/AddCategory";
import CategoriesList from "./Components/Admin/Category/CategoriesList";
import EditCategory from "./Components/Admin/Category/EditCategory";
import AdminSidebar from "./Components/Admin/Shared/AdminSidebar";
import AddProduct from "./Components/Admin/Products/AddProduct";
import ProductList from "./Components/Admin/Products/ProductList";
import EditProduct from "./Components/Admin/Products/EditProduct";
import ConsumersList from "./Components/Admin/ConsumersList";
import ProtectedAdminHome from "./Private/ProtectedAdminHome";
import OrdersList from "./Components/Admin/Order/OrdersList";

function Admin() {
  return (
    <Provider store={store}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className=" lg:w-64 lg:fixed lg:h-full">
          <AdminSidebar />
        </div>
        <div className="flex-grow lg:ml-64 p-2 md:p-6 overflow-y-auto ">
          {" "}
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedAdminHome>
                  <Dashboard />
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
            <Route path="/categoriesList" element={<CategoriesList />} />
            <Route path="/edit-categories/:id" element={<EditCategory />} />

            {/* products  */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/productList" element={<ProductList />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />

            {/* consumersList */}
            <Route path="consumersList" element={<ConsumersList />} />

            {/* Order  */}
            <Route path="orders" element={<OrdersList />} />
          </Routes>
        </div>
      </div>
    </Provider>
  );
}

export default Admin;
