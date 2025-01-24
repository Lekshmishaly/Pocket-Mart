import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import User from "./User";
import Admin from "./Admin";
import Login from "./Components/Admin/Login";
import ProtectedAdminLogin from "./Private/ProtectedAdminLogin";
import ScrollToTop from "./Utils/ScrollToTop";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster richColors position="top-left" />
      <ToastContainer position="top-left" />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/*" element={<User />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route
              path="/admin/login"
              element={
                <ProtectedAdminLogin>
                  <Login />
                </ProtectedAdminLogin>
              }
            />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
