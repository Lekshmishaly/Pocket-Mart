import HeroSection from "@/Components/User/HeroSection";
import ProductContainer from "@/Components/User/ProductContainer";
import Qoute from "@/Components/User/Shared/Qoute";
import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import React from "react";

function HomePage() {
  return (
    <>
      <Header name={"Shop Page"} />
      <HeroSection />
      <Qoute />
      <ProductContainer title={"New Arraiwals"} />

      <Footer />
    </>
  );
}

export default HomePage;
