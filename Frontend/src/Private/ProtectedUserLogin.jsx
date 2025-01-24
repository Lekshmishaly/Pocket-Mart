import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedUserLogin({ children }) {
  const userData = useSelector((store) => store.user.userDetails);
  if (userData) {
    return <Navigate to={"/"} />;
  }
  return children;
}

export default ProtectedUserLogin;
