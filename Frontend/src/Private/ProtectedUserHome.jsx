import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedUserHome({ children }) {
  const userData = useSelector((store) => store.user.userDetails);
  if (!userData) {
    return <Navigate to={"/login"} />;
  }
  return children;
}

export default ProtectedUserHome;
