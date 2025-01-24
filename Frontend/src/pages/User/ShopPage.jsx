import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import Shop from "@/Components/User/Shop";
import React from "react";

function ShopPage() {
  return (
    <>
      <Header name={"Shop Page"} />
      <Shop />
      <Footer />
    </>
  );
}

export default ShopPage;
