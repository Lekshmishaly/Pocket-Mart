import axiosInstance from "@/Utils/AxiosConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Cart() {
  const userData = useSelector((store) => store.user.userDetails);

  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [stockStatus, setStockStatus] = useState({});
  const [totalDiscount, setTotalDiscount] = useState(0);

  ////////////////////////////// //Fetch Cart //////////////////////////////

  async function fetchCart() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);

      // Set cart items and subtotal (handle cases where cartItems or items may be empty)
      const cartData = response.data.cartItems || {
        items: [],
        totalCartValue: 0,
        totalDiscount: 0,
      };
      setCartItems(cartData.items || []);
      setSubtotal(cartData.totalCartValue || 0);
      setTotalDiscount(cartData.totalDiscount || 0);
      const stockChecks = {};
      cartData.items.forEach((item) => {
        stockChecks[item._id] = item.qty <= (item.productId.stock || 0);
      });

      setStockStatus(stockChecks);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  /////////////////////////// //handle Remove Items// ///////////////////////////

  async function handleRemoveItems(item) {
    try {
      const response = await axiosInstance.delete(
        `/user/cart/${item._id}/${userData._id}`
      );
      setReload(true);
      return toast.success(response.data.message);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  }
  /////////////////////////// //handle Minus// ///////////////////////////

  async function handelMinus(item) {
    try {
      const response = await axiosInstance.patch(
        `/user/cart/min/${item._id}/${userData._id}`
      );

      setReload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  /////////////////////////// //handle Plus// ///////////////////////////

  async function handelPlus(item) {
    try {
      const response = await axiosInstance.patch(
        `/user/cart/add/${item._id}/${userData._id}`
      );

      setReload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCart();
    setReload(false);
  }, [reload, userData]); // Added userData to dependencies
  return (
    <div className="mt-24 bg-[#f4ede3]">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <span className="text-lg font-[Satisfy] text-[#331e16]">
              Your Cart is Empty
            </span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-[#d3d2d2]">
                  <th className="text-left pb-6 text-sm font-normal font-Futura-Light text-[#8b5d4b] w-[45%]">
                    Product
                  </th>
                  <th className="text-left pb-6 text-sm font-normal font-Futura-Light text-[#8b5d4b] w-[15%]">
                    Size
                  </th>
                  <th className="text-left pb-6 text-sm font-normal font-Futura-Light text-[#8b5d4b] w-[15%]">
                    Price
                  </th>
                  <th className="text-left pb-6 text-sm font-normal font-Futura-Light text-[#8b5d4b] w-[15%]">
                    Quantity
                  </th>
                  <th className="text-right pb-6 text-sm font-normal font-Futura-Light text-[#8b5d4b] w-[10%]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, i) => (
                  <tr key={i} className="align-top border-t border-[#d3d2d2]">
                    <td className="py-4">
                      <div className="flex gap-6">
                        <div className="relative">
                          <img
                            src={item.productId.images[0] || "/placeholder.svg"}
                            alt={item.productId.name}
                            className={`w-[122px] h-[182px] object-cover ${
                              stockStatus[item._id] ? "opacity-50" : ""
                            }`}
                          />
                          {stockStatus[item._id] && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-Futura-Light text-[#8b5d4b]">
                            {item.productId.name}
                          </h3>
                          {stockStatus[item._id] && (
                            <p className="text-red-500 text-sm mt-2">
                              Out of Stock
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] align-top">
                      {item.size}
                    </td>
                    <td className="py-4 align-top">
                      <div className="space-y-1">
                        {item.discountAmount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            INR {item.productId.price.toLocaleString("en-IN")}
                            .00
                          </p>
                        )}
                        <p className="text-sm text-[#8b5d4b]">
                          ₹
                          {Math.round(item.discountedAmount).toLocaleString(
                            "en-IN"
                          )}
                          .00
                        </p>
                      </div>
                    </td>
                    <td className="py-4 align-top">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handelMinus(item)}
                          className="text-[#8b5d4b] text-sm hover:text-[#6d483a] transition">
                          −
                        </button>
                        <span className="text-sm text-[#8b5d4b]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handelPlus(item)}
                          disabled={item.stock === 0}
                          className={`text-sm ${
                            item.stock !== 0
                              ? "text-[#8b5d4b] hover:text-[#6d483a]"
                              : "opacity-50 cursor-not-allowed"
                          }`}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right align-top">
                      <div className="space-y-1">
                        <p className="text-sm text-[#8b5d4b]">
                          INR{" "}
                          {Math.round(item.totalProductPrice).toLocaleString(
                            "en-IN"
                          )}
                          .00
                        </p>
                        {item.discount > 0 && (
                          <div>
                            <span className="text-[10px] text-[#ce472c] font-semibold">
                              {item.discount}% off
                            </span>
                          </div>
                        )}
                        {item.discountAmount > 0 && (
                          <p className="text-[#928380] text-xs mt-1">
                            -₹
                            {Math.round(item.discountAmount).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}
                        <button
                          onClick={() => handleRemoveItems(item)}
                          className="pt-4 text-xs text-[#8b5d4b] font-[Satisfy] border-b border-[#8b5d4b] hover:text-[#6d483a] transition">
                          Remove item
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="sm:hidden flex flex-col gap-6">
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className="border border-[#d3d2d2] p-3 rounded bg-white">
                  <div className="flex gap-3">
                    <img
                      src={item.productId.images[0] || "/placeholder.svg"}
                      alt={item.productId.name}
                      className="w-[90px] h-[130px] object-cover rounded"
                    />
                    <div className="flex-1 text-xs text-[#8b5d4b] space-y-1">
                      <div className="font-medium">{item.productId.name}</div>
                      <div>Size: {item.size}</div>
                      <div className="space-y-1">
                        {item.discountAmount > 0 && (
                          <div className="line-through text-[11px] text-gray-400">
                            ₹{item.productId.price.toLocaleString("en-IN")}.00
                          </div>
                        )}
                        <div className="font-semibold text-sm">
                          ₹
                          {Math.round(item.discountedAmount).toLocaleString(
                            "en-IN"
                          )}
                          .00
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handelMinus(item)}
                          className="text-[#8b5d4b] text-sm">
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => handelPlus(item)}
                          disabled={item.stock === 0}
                          className={`${
                            item.stock === 0
                              ? "opacity-50 cursor-not-allowed"
                              : "text-[#8b5d4b]"
                          } text-sm`}>
                          +
                        </button>
                      </div>
                      <div className="text-sm font-medium mt-1">
                        Total: ₹
                        {Math.round(item.totalProductPrice).toLocaleString(
                          "en-IN"
                        )}
                        .00
                      </div>
                      {item.discount > 0 && (
                        <div className="text-[10px] text-[#ce472c]">
                          {item.discount}% off
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveItems(item)}
                        className="mt-2 text-[10px] underline text-[#8b5d4b] hover:text-[#6d483a]">
                        Remove item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length === 0 ? (
        <div className="flex justify-center py-5">
          <button
            onClick={() => navigate("/shop-page")}
            className="w-40 h-10 font-thin text-sm sans-serif rounded bg-[#733519] hover:bg-[#713d28] text-white transition-colors">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="bg-[#733519] text-white py-6 px-3 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Subtotal row */}
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-sm font-Futura-Light opacity-80">
                  Subtotal
                </p>
                <p className="text-xs sm:text-sm font-Futura-Light opacity-80 mb-2">
                  INR{" "}
                  {subtotal ? Math.round(subtotal).toLocaleString("en-IN") : 0}
                  .00
                </p>
              </div>

              {/* Total Savings */}
              {totalDiscount !== 0 && (
                <div className="flex justify-between items-start">
                  <p className="text-xs sm:text-sm font-Futura-Light opacity-80">
                    Total Saves
                  </p>
                  <p className="text-xs sm:text-sm font-Futura-Light opacity-50 mb-2">
                    -₹{Math.round(totalDiscount).toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              {/* Tax + Checkout row */}
              <div className="flex justify-between items-start flex-wrap sm:flex-nowrap">
                {/* Responsive label */}
                <p className="text-xs sm:text-sm font-Futura-Light opacity-80 mt-1 max-w-[60%]">
                  <span className="block sm:hidden">
                    Tax included and shipping <br />
                    calculated at checkout
                  </span>
                  <span className="hidden sm:inline">
                    Tax included and shipping calculated at checkout
                  </span>
                </p>

                {/* Checkout Button aligned right */}
                <button
                  onClick={() => navigate("/checkout")}
                  disabled={subtotal === 0}
                  className={`text-xs sm:text-sm font-Futura-Light border-b border-white mt-2 sm:mt-0 ${
                    subtotal === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-80 hover:opacity-100"
                  }`}>
                  {subtotal === 0 ? "All items are out of stock" : "Checkout →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
