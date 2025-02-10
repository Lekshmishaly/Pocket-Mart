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

function CheckOut() {
  const userData = useSelector((store) => store.user.userDetails);
  const [selectAddressCheckout, setSelectedAddressCheckout] = useState({});
  const [selectPayment, setSelectPayment] = useState("");
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [isModalOpen, setisModalOpen] = useState(false);

  const navigate = useNavigate();

  async function fetchCart() {
    try {
      const response = await axiosInstance.get(
        `/user/cart/checkout/${userData._id}`
      );

      setCart(response.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  async function handleOrderPlacement() {
    if (Object.keys(selectAddressCheckout).length === 0) {
      return toast.warning("Address is not selected");
    }

    if (!selectPayment) {
      return toast.warning("Choose a payment method to continue");
    }
    console.log("cart.items>>>>>>", cart.items);

    try {
      const response = await axiosInstance.post("/user/order", {
        user: userData._id,
        cartItems: cart.items,
        total_amount: cart.totalCartValue,
        shipping_address: selectAddressCheckout,
        payment_method: selectPayment,
        payment_status: "pending",
      });

      setOrder(response.data.order);

      const res = await axiosInstance.put("/user/cart/remove-items", {
        order_items: response.data.order.order_items,
        user: userData._id,
      });

      setisModalOpen(true);
      return toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <VerifiedModal order={order} isModalOpen={isModalOpen} />
      {/* Main Content - Split Layout */}
      <div className="flex">
        {/* Left Container - 55% */}
        <div className="w-[55%] h-100vh overflow-y-auto ">
          <div className="max-w-3xl  mb-5  mt-8 ms-24 me-7  ">
            {/* Contact Section */}

            <div className="w-[55%]   ">
              <span className="text-2xl font-sm  text-[#312617de] ">
                𝒫𝑜𝒸𝓀𝑒𝓉 𝑀𝒶𝓇𝓉
              </span>
              <div className="flex mt-4 justify-start space-x-3 text-sm">
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
            <div className="space-y-6 m-18">
              <h2 className="text-2xl mt-10 font-Futura-Light font-[Satisfy] text-gray-900">
                Shipping address
              </h2>

              <AddressManagement
                setSelectedAddressCheckout={setSelectedAddressCheckout}
              />
            </div>

            {/* Payment on Address Section  */}
            <div className="space-y-6 mt-10">
              <div>
                <h1 className="text-2xl font-Futura-Light font-[Satisfy] text-gray-900">
                  Payment
                </h1>
              </div>
              <div className="bg-[#f4ede3] flex flex-col  gap-4 mb-4  ">
                <p className="text-gray-500 mt-2 mx-6">
                  All transactions are secure and encrypted.
                </p>

                <div className="border border-[#d4c9bc] bg-[#eae0d3] rounded-lg  mx-6">
                  {/* Wallet Option */}
                  <div className="p-4 flex items-center justify-between ">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="wallet"
                        name="paymentMethod"
                        onChange={() => {
                          "";
                        }}
                      />
                      <label
                        htmlFor="credit-card"
                        className="text-[#8b5d4b] text-sm hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
                        Wallet
                      </label>
                    </div>
                  </div>
                </div>

                {/* Razorpay Option */}
                <div className="border p-4 border-[#d4c9bc] bg-[#eae0d3] rounded-lg   mx-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="razorpay"
                        name="paymentMethod"
                        className="h-4 w-4 text-[#8b5d4b] border-[#d4c9bc] focus:ring-[#8b5d4b]"
                      />
                      <label
                        htmlFor="razorpay"
                        className="text-[#8b5d4b] text-sm hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src={upiCmgCfll8} alt="UPI" className="h-6" />
                      <img src={visasxIq5Dot} alt="Visa" className="h-6" />
                      <img
                        src={masterCzeoQWmc}
                        alt="Mastercard"
                        className="h-6"
                      />
                      <img src={rupayBl62X6PG} alt="RuPay" className="h-6" />
                    </div>
                  </div>
                </div>

                {/* COD Option */}
                <div className="border border-[#d4c9bc] bg-[#eae0d3] rounded-lg p-4  mx-6 mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      name="paymentMethod"
                      onChange={(event) => setSelectPayment(event.target.value)}
                      className="h-4 w-4 text-[#8b5d4b]  focus:ring-[#8b5d4b]"
                    />
                    <label
                      htmlFor="cod"
                      className="text-[#8b5d4b] text-sm hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6">
              <button className="text-[#8b5d4b] hover:text-[#693f2c] text-sm flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
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
                <span onClick={() => navigate("/cart")}>Return to cart</span>
              </button>
              <button
                onClick={handleOrderPlacement}
                className="bg-[#693f2c] text-white px-6 py-3 rounded-none hover:bg-[#8b5d4b] transition-colors duration-200 text-sm">
                Order Place
              </button>
            </div>
          </div>
        </div>

        {/* Right Container - 45% */}
        <div className="w-[45%] bg-[#f4ede3] h-100vh sticky right-0 overflow-hidden border-l border-gray-300">
          {" "}
          <div className=" max-w-xl mt-8 me-28  ms-7">
            <div className="space-y-6">
              {Array.isArray(cart.items) &&
                cart.items.map(
                  (item, i) =>
                    item.stock !== 0 && (
                      <>
                        {" "}
                        <div key={i} className="flex items-start space-x-4">
                          <div className="relative">
                            <img
                              src={item.productId.images[0]}
                              alt="Givah Jacket Set"
                              className="w-16 h-20 object-cover"
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {item.qty}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-Futura-Light text-gray-900">
                              {item.productId.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {" "}
                              Size: {item.size}
                            </p>
                          </div>
                          <p className="text-sm font-Futura-Light ">
                            ₹{item.price}
                          </p>
                        </div>
                      </>
                    )
                )}

              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Discount code or gift card"
                  className="flex-1 p-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#8b5d4b] text-sm bg-white"
                />
                <button className="bg-[#e2d9d0] px-6 py-3 rounded-none text-sm hover:bg-[#d4c9bc] transition-colors duration-200">
                  Apply
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-300">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-semibold">
                    ₹{cart.totalCartValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm">Calculated at next step</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-300">
                  <span className="text-xl font-semibold ">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-semibold text-gray-500 mr-2">
                      INR
                    </span>
                    <span className="text-xl font-semibold">
                      ₹{cart.totalCartValue}
                    </span>
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
