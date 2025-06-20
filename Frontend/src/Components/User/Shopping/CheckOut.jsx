import AddressManagement from "../Profile/AddressManagement";
import masterCzeoQWmc from "../../../assets/master.CzeoQWmc.svg";
import rupayBl62X6PG from "../../../assets/rupay.Bl62X6PG.svg";
import upiCmgCfll8 from "../../../assets/upi.CmgCfll8.svg";
import visasxIq5Dot from "../../../assets/visa.sxIq5Dot.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/Utils/AxiosConfig";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import VerifiedModal from "./VerifiedModal";
import PaymentComponent from "@/Components/ui/PaymentComponent";
import { fetchWalletInfoApi, deductMoneyFromWalletApi } from "@/APIs/Wallet";
import { appyCouponApi, updateCouponDataApi } from "@/APIs/Shopping/Coupon";

function CheckOut() {
  const userData = useSelector((store) => store.user.userDetails);
  const [selectAddressCheckout, setSelectedAddressCheckout] = useState({});
  const [selectPayment, setSelectPayment] = useState("");
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [isModalOpen, setisModalOpen] = useState(false);
  const [Walletbalance, setWalletBalance] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [coupon_Discount, setcoupon_Discount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [retryPayment, setRetryPayment] = useState({});
  //GRAND TOTAL PRICE
  const [total_price_with_discount, settotal_price_with_discount] = useState(0);

  const [couponCode, setCouponCode] = useState("");
  const [verifiedCouponCode, setverifiedCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const navigate = useNavigate();

  //////////////////////////////// fetch Cart //////////////////////////////////

  async function fetchCart() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);

      const cartData = response.data.cartItems || {
        items: [],
        totalCartValue: 0,
        totalDiscount: 0,
      };

      setCart(cartData.items || []);
      setSubtotal(cartData.totalCartValue || 0);

      const offerDiscount = cartData.totalDiscount;

      setTotalDiscount(offerDiscount + coupon_Discount);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  //////////////////////////////// fetch order //////////////////////////////////

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get(
        `/user/fetchorders/${userData._id}`
      );
      setRetryPayment(response.data.orderDetails);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }

  ////////////////////////// handleOrderPlacement //////////////////////////////

  async function handleOrderPlacement() {
    try {
      if (Object.keys(selectAddressCheckout).length === 0) {
        return toast.warning("Address is not selected");
      }

      if (!selectPayment) {
        return toast.warning("Choose a payment method to continue");
      }

      if (selectPayment === "wallet") {
        const response = await fetchWalletInfoApi(userData._id);
        const latestWalletBalance = response.data.myWallet.balance;

        if (latestWalletBalance < total_price_with_discount) {
          return toast.error(
            "Your wallet balance is insufficient to complete this payment"
          );
        }

        setWalletBalance(latestWalletBalance); // Optional, if you want to keep it in state
      } else {
        setWalletBalance(0);
      }

      // ✅ Step 5: Create Order
      const response = await axiosInstance.post("/user/order", {
        user: userData._id,
        cartItems: cart,
        total_amount: subtotal,
        totalDiscount,
        coupon_Discount,
        total_price_with_discount,
        shipping_address: selectAddressCheckout,
        payment_method: selectPayment,
        payment_status: "Pending",
      });

      setOrder(response.data.order);

      await axiosInstance.put("/user/cart/remove-items", {
        order_items: response.data.order.order_items,
        user: userData._id,
      });

      if (selectPayment === "wallet") {
        await deductMoneyFromWalletApi(
          userData._id,
          response.data.order._id,
          subtotal
        );
      }

      setisModalOpen(true);
      if (couponData) {
        handleUpdateCoupon(couponData._id, userData._id);
      }
      return toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  ////////////////////////////// playment Success /////////////////////////////

  const handlePaymentSuccess = async () => {
    try {
      const response = await axiosInstance.post("/user/order", {
        user: userData._id,
        cartItems: cart,
        total_amount: subtotal,
        totalDiscount,
        coupon_Discount,
        total_price_with_discount,
        shipping_address: selectAddressCheckout,
        payment_method: selectPayment,
        payment_status: "Paid",
      });

      setOrder(response.data.order);

      await fetchOrderDetails();

      const res = await axiosInstance.put("/user/cart/remove-items", {
        order_items: response.data.order.order_items,
        user: userData._id,
      });

      setisModalOpen(true);
      if (couponData) {
        handleUpdateCoupon(couponData._id, userData._id);
      }
      return toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////////////////// playment Failure //////////////////////////////

  const handlePaymentFailure = async () => {
    try {
      const response = await axiosInstance.post("/user/order", {
        user: userData._id,
        cartItems: cart,
        total_amount: subtotal,
        totalDiscount,
        coupon_Discount,
        total_price_with_discount,
        shipping_address: selectAddressCheckout,
        payment_method: selectPayment,
        payment_status: "Failed",
      });

      setOrder(response.data.order);

      const res = await axiosInstance.put("/user/cart/remove-items", {
        order_items: response.data.order.order_items,
        user: userData._id,
      });

      setisModalOpen(true);
      if (couponData) {
        handleUpdateCoupon(couponData._id, userData._id);
      }
      return toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////////////////////////////// Apply Coupon Logic ///////////////////////////////////////////

  async function handleApplyCoupon() {
    try {
      const response = await appyCouponApi(couponCode);
      const data = response.data.CouponData;

      const userApplied = data.users_applied.find(
        (user_applied) => user_applied.user == userData._id
      );

      if (userApplied && userApplied.used_count >= data.usage_limit) {
        return toast.error(
          "You have reached the maximum limit of the coupon usage"
        );
      }

      setCouponData(data);

      const discountPercentage = data.discountValue;
      const calculatedDiscount = (subtotal * discountPercentage) / 100;

      if (data.min_purchase_amount < subtotal) {
        setcoupon_Discount(calculatedDiscount);
        setverifiedCouponCode(data.code);
      } else {
        toast.error("Sorry, the coupon is not valid for this purchase.");
        handleRemoveCoupon();
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.error(err);
    }
  }

  ///////////////////////////// UPDATE COUPON DATA ///////////////////////////////

  async function handleUpdateCoupon(coupon_id, user_id) {
    try {
      const response = await updateCouponDataApi(coupon_id, user_id);
    } catch (err) {
      console.log(err);
    }
  }

  ///////////////////////////// COUPON REMOVAL LOGIC ///////////////////////////////

  function handleRemoveCoupon() {
    settotal_price_with_discount(total_price_with_discount + coupon_Discount);
    setcoupon_Discount(0);
    setTotalDiscount(totalDiscount - coupon_Discount);
    setCouponData(null);
    setCouponDiscount(0);
  }

  //--------------TOTAL PRICE CALCULATION WITH AND WITHOUT COUPON------------
  useEffect(() => {
    fetchCart();
    fetchOrderDetails();

    if (couponData) {
      const discount = coupon_Discount;
      const maxDiscount = couponData.max_discount_amount;
      const minPurchaseAmount = couponData.min_purchase_amount;

      if (subtotal > minPurchaseAmount) {
        const effectiveDiscount = Math.min(discount, maxDiscount);

        setcoupon_Discount(effectiveDiscount);
        settotal_price_with_discount(subtotal - effectiveDiscount);
      } else {
        toast.error("Sorry, the coupon is not valid for this purchase.");
      }
    } else {
      settotal_price_with_discount(subtotal);
      setcoupon_Discount(0);
      setCouponData(null);
    }
  }, [totalDiscount, coupon_Discount, subtotal, couponData]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (selectPayment === "wallet") {
        try {
          const response = await fetchWalletInfoApi(userData._id);
          const latestWalletBalance = response.data.myWallet.balance;
          setWalletBalance(latestWalletBalance);
        } catch (error) {
          console.error("Failed to fetch wallet balance", error);
        }
      }
    };

    fetchWalletBalance();
  }, [selectPayment, userData._id]);
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <VerifiedModal order={order} isModalOpen={isModalOpen} />
      {/* Main Content - Split Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Container - 55% */}
        <div className="w-full lg:w-[55%] h-screen overflow-y-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 mt-8 mx-auto">
            {/* Contact Section */}
            <div className="w-full">
              <span className="text-xl sm:text-2xl font-semibold text-[#312617de]">
                𝒫𝑜𝒸𝓀𝑒𝓉 𝑀𝒶𝓇𝓉
              </span>
              <div className="flex flex-wrap gap-1 mt-4 text-xs sm:text-sm">
                <span
                  onClick={() => navigate("/cart")}
                  className="text-[#8b5d4b] cursor-pointer">
                  Cart
                </span>
                <span className="font-medium text-black">CheckOut</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-gray-400">Shipping</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-gray-400">Payment</span>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl mt-10 font-Futura-Light font-[Satisfy] text-gray-900">
                Shipping address
              </h2>
              <AddressManagement
                setSelectedAddressCheckout={setSelectedAddressCheckout}
              />
            </div>

            {/* Payment Section */}
            <div className="space-y-6 mt-10">
              <h1 className="text-xl sm:text-2xl font-Futura-Light font-[Satisfy] text-gray-900">
                Payment
              </h1>
              <div className="bg-[#f4ede3] flex flex-col gap-4 mb-4">
                <p className="text-gray-500 mt-2 mx-6 text-sm">
                  All transactions are secure and encrypted.
                </p>
                {/* Wallet Option */}
                <div className="border border-[#d4c9bc] bg-[#eae0d3] rounded-lg mx-6 p-4">
                  <div className="flex items-start sm:items-center space-x-3">
                    <input
                      type="radio"
                      value="wallet"
                      name="paymentMethod"
                      onChange={(e) => setSelectPayment(e.target.value)}
                      className="h-4 w-4 text-[#8b5d4b] focus:ring-[#8b5d4b] mt-0.5"
                    />
                    <label className="text-xs sm:text-sm text-[#8b5d4b] hover:text-[#6d483a] font-Futura-Light">
                      Wallet
                    </label>
                  </div>
                  {selectPayment === "wallet" && Walletbalance > 0 && (
                    <div className="w-full flex justify-end pr-2 sm:pr-4 mt-2">
                      <div className="text-right text-[11px] sm:text-sm md:text-[13px] lg:text-[14px] text-gray-700 font-medium">
                        <span className="block text-gray-500">
                          Total Wallet Balance:
                        </span>
                        <span className="block text-green-600 font-semibold">
                          ₹{Walletbalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Razorpay Option */}
                <div className="border border-[#d4c9bc] bg-[#eae0d3] rounded-lg mx-6 sm:mx-6 p-4">
                  {/* Default layout for all screens */}
                  <div className="flex items-start sm:items-center gap-3 sm:justify-between">
                    {/* Radio + Label on the left for all screen sizes */}
                    <div className="flex items-start sm:items-center gap-3">
                      <input
                        type="radio"
                        value="Razor Pay"
                        name="paymentMethod"
                        checked={selectPayment === "Razor Pay"}
                        onChange={(e) => setSelectPayment(e.target.value)}
                        className="h-4 w-4 mt-1 sm:mt-0 text-[#8b5d4b] border-[#d4c9bc] focus:ring-[#8b5d4b]"
                      />
                      <label className="text-xs sm:text-sm text-[#8b5d4b] hover:text-[#6d483a] font-Futura-Light leading-snug max-w-[18rem] sm:max-w-full">
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                      </label>
                    </div>

                    {/* Payment icons (only when Razorpay not selected) */}
                    {selectPayment !== "Razor Pay" && (
                      <div className="flex flex-row items-center gap-2 justify-start sm:justify-end mt-2 sm:mt-0 overflow-x-auto">
                        <img
                          src={upiCmgCfll8}
                          alt="UPI"
                          className="h-6 w-auto"
                        />
                        <img
                          src={visasxIq5Dot}
                          alt="Visa"
                          className="h-6 w-auto"
                        />
                        <img
                          src={masterCzeoQWmc}
                          alt="Mastercard"
                          className="h-6 w-auto"
                        />
                        <img
                          src={rupayBl62X6PG}
                          alt="RuPay"
                          className="h-6 w-auto"
                        />
                      </div>
                    )}
                  </div>

                  {/* Razorpay layout ONLY when selected and on large screen */}
                  {selectPayment === "Razor Pay" && (
                    <div className="hidden lg:flex mt-4 flex-col items-center">
                      <div className="w-full max-w-md">
                        <PaymentComponent
                          address={selectAddressCheckout}
                          amount={total_price_with_discount}
                          onSuccess={handlePaymentSuccess}
                          onFailure={handlePaymentFailure}
                          title={"Pay Now"}
                        />
                      </div>
                    </div>
                  )}

                  {total_price_with_discount > 100000 && (
                    <div className="text-red-500 text-xs lg:text-sm font-medium mt-2">
                      You cannot pay above ₹1,00,000 using Razorpay. Please
                      choose another method.
                    </div>
                  )}

                  {/* Razorpay layout on mobile & tablet (below radio like other options) */}
                  {selectPayment === "Razor Pay" && (
                    <div className="lg:hidden mt-3">
                      <PaymentComponent
                        address={selectAddressCheckout}
                        amount={total_price_with_discount}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        title={"Pay Now"}
                      />

                      {total_price_with_discount > 100000 && (
                        <div className="text-red-500 text-xs font-medium mt-2">
                          You cannot pay above ₹1,00,000 using Razorpay. Please
                          choose another method.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div className="border border-[#d4c9bc] bg-[#eae0d3] rounded-lg mx-6 p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      name="paymentMethod"
                      onChange={(e) => setSelectPayment(e.target.value)}
                      className="h-4 w-4 text-[#8b5d4b] focus:ring-[#8b5d4b]"
                    />
                    <label className="text-xs sm:text-sm text-[#8b5d4b] hover:text-[#6d483a] font-Futura-Light">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Section - 45% */}
        <div className="w-full lg:w-[45%] bg-[#f4ede3] lg:h-screen sticky right-0 overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-300 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-xl mt-8 mx-auto mb-4">
            <div className="space-y-6">
              {Array.isArray(cart) &&
                cart.map(
                  (item, i) =>
                    item.stock !== 0 && (
                      <div key={i} className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={item.productId.images[0]}
                            alt="Product"
                            className="w-14 h-16 sm:w-16 sm:h-20 object-cover"
                          />
                          <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-Futura-Light text-gray-900">
                            {item.productId.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="text-right text-sm font-Futura-Light text-gray-700">
                          ₹
                          {Math.round(item.totalProductPrice).toLocaleString(
                            "en-IN"
                          )}
                          .00
                          {item.discount > 0 && (
                            <p className="text-[9.7px] text-[#ce472c] font-semibold">
                              {item.discount}% off
                            </p>
                          )}
                          {item.discountAmount > 0 && (
                            <p className="text-[9.7px]">
                              -₹
                              {Math.round(item.discountAmount).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                )}

              {/* Coupon Input */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  placeholder="coupon code or Discount code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 p-2 sm:p-3 border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#8b5d4b]"
                />
                {couponData ? (
                  <button
                    className="bg-[#e2d9d0] px-4 py-2 sm:px-6 sm:py-3 text-sm hover:bg-[#d4c9bc]"
                    onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    className="bg-[#e2d9d0] px-4 py-2 sm:px-6 sm:py-3 text-sm hover:bg-[#d4c9bc]"
                    onClick={handleApplyCoupon}>
                    Apply
                  </button>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-4 border-t border-gray-300 text-sm sm:text-base">
                {totalDiscount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">You save</span>
                    <span className="font-semibold text-gray-600">
                      -₹{Math.round(totalDiscount).toLocaleString("en-IN")}.00
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                {verifiedCouponCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Code:</span>
                    <span className="text-gray-600">{verifiedCouponCode}</span>
                  </div>
                )}
                {coupon_Discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Coupon Discount Amount:
                    </span>
                    <span className="text-gray-600">
                      -₹{coupon_Discount.toFixed(2)}
                    </span>
                  </div>
                )}
                {total_price_with_discount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-600">
                      ₹
                      {Math.round(total_price_with_discount).toLocaleString(
                        "en-IN"
                      )}
                      .00
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  {/* Left Side Label */}
                  <span className="text-base sm:text-xl font-semibold text-gray-800">
                    Total Payable
                  </span>

                  {/* Right Side Amount */}
                  <div className="flex items-baseline space-x-1 text-right">
                    <span className="text-sm sm:text-lg font-semibold text-gray-500">
                      INR
                    </span>
                    <span className="text-base sm:text-xl font-semibold text-gray-800">
                      ₹
                      {Math.round(total_price_with_discount).toLocaleString(
                        "en-IN"
                      )}
                      .00
                    </span>
                  </div>
                </div>
              </div>
              {/* Navigation Buttons */}
              <div className="w-full lg:px-0 mb-10">
                <div className="max-w-[600px] mx-auto w-full flex justify-between items-center pt-6">
                  {/* Return to Cart Button */}
                  <div className="w-1/2 flex justify-start">
                    <button
                      className="text-[#8b5d4b] hover:text-[#693f2c] text-sm flex items-center "
                      onClick={() => navigate("/cart")}>
                      <svg
                        className="w-4 h-4 align-middle"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="m-0 p-0 align-middle">
                        Return to cart
                      </span>
                    </button>
                  </div>

                  {/* Place Order Button */}
                  <div className="w-1/2 flex justify-end">
                    <button
                      onClick={handleOrderPlacement}
                      className="bg-[#693f2c] text-white px-6 py-3 rounded-none hover:bg-[#8b5d4b] transition-colors duration-200 text-sm">
                      Order Place
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
