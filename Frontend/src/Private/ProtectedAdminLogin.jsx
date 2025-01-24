import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedAdminLogin({ children }) {
  const adminData = useSelector((state) => state?.admin?.adminDetails);

  if (adminData) {
    return <Navigate to={"/admin/productList"} />;
  }
  return children;
}

export default ProtectedAdminLogin;
