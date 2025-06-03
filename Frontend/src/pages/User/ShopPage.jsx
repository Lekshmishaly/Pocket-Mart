import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import Shop from "@/Components/User/Shop";
import React from "react";
import { useParams } from "react-router-dom";

function ShopPage() {
  const { search } = useParams();
  return (
    <>
      <Header name={"Shop Page"} />
      <Shop search={search} />

      <Footer />
    </>
  );
}

export default ShopPage;
