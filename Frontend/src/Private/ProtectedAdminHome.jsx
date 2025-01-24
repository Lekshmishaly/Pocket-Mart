import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedAdminHome({ children }) {
  const adminData = useSelector((state) => state?.admin?.adminDetails);

  if (!adminData) {
    return <Navigate to={"/admin/login"} />;
  }
  return children;
}

export default ProtectedAdminHome;
