import HeroSection from "@/Components/User/HeroSection";
import ProductContainer from "@/Components/User/ProductContainer";
import Qoute from "@/Components/User/Shared/Qoute";
import Footer from "@/Components/User/Shared/Footer";
import Header from "@/Components/User/Shared/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReferralPopup from "@/Components/User/ReferralPopup";

function HomePage() {
  const userData = useSelector((store) => store.user.userDetails);

  // Referral Code
  const [isOpen, setIsOpen] = useState(false);
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    // If ref code exists in URL and user hasn't been referred yet

    setReferralCodeFromUrl(refCode);
    setIsOpen(!userData?.usedReferral);
  }, []);

  return (
    <>
      {userData && (
        <ReferralPopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user_id={userData._id}
          defaultReferralCode={referralCodeFromUrl}
        />
      )}
      <Header name={"Shop Page"} />
      <HeroSection />
      <Qoute />
      <ProductContainer title={"New Arraiwals"} />

      <Footer />
    </>
  );
}

export default HomePage;
