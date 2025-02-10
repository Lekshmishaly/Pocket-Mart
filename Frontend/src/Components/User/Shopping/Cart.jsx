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

  /////////////////////////// //Fetch Cart// ///////////////////////////

  async function fetchCart() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);

      // Set cart items and subtotal (handle cases where cartItems or items may be empty)
      const cartData = response.data.cartItems || {
        items: [],
        totalCartValue: 0,
      };
      setCartItems(cartData.items || []);
      setSubtotal(cartData.totalCartValue || 0);

      const stockChecks = {};
      cartData.items.forEach((item) => {
        stockChecks[item._id] = item.qty <= (item.productId.stock || 0);
      });

      console.log("stock ", stockChecks);
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
      // console.log(response.data);
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
      // console.log(response.data);
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
        {/* Cart Table */}
        {cartItems.length === 0 ? (
          <div className="text-center ">
            <span className="text-lg  font-[Satisfy] text-[#331e16]">
              Your Cart is Empty{" "}
            </span>
          </div>
        ) : (
          <table className="w-full">
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
            <tbody className="max-w-28">
              {Array.isArray(cartItems) &&
                cartItems.map((item, i) => (
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
                        <div className="">
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
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] align-top ">
                      {item.size}
                    </td>
                    <td className="py-4 align-top ">
                      <div className="space-y-1">
                        <p className="text-sm font-Futura-Light text-[#8b5d4b] line-through">
                          INR {item.productId.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-Futura-Light text-[#8b5d4b]">
                          INR {item.productId.price.toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 align-top ">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handelMinus(item)}
                          className="text-[#8b5d4b] text-sm font-Futura-Light hover:text-[#6d483a] transition-colors duration-200">
                          −
                        </button>
                        <span className="text-sm font-Futura-Light text-[#8b5d4b]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handelPlus(item)}
                          disabled={item.stock === 0}
                          className={`text-[#8b5d4b] text-sm font-Futura-Light ${
                            item.stock !== 0
                              ? "hover:text-[#6d483a] transition-colors duration-200"
                              : "opacity-50 cursor-not-allowed"
                          }`}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right align-top ">
                      <div className="space-y-2">
                        <p className="text-sm font-Futura-Light text-[#8b5d4b]">
                          INR {item.totalProductPrice.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItems(item)}
                          className="pt-8  text-[#8b5d4b] text-sm font-Futura-Light border-b font-[Satisfy] border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200">
                          Remove item
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
        <div className=" bg-[#733519] text-white py-6 ">
          <div className="flex justify-around gap-32">
            <div>
              <p className="text-sm font-Futura-Light  opacity-80">Subtotal</p>
              <p className="text-sm font-Futura-Light opacity-80 mt-1">
                Tax included and shipping calculated at checkout
              </p>
            </div>
            <div className="flex flex-col items-center">
              {subtotal !== 0 && (
                <p className="text-sm font-Futura-Light  opacity-80  mb-2">
                  INR {subtotal ? subtotal.toFixed(2) : 0}
                </p>
              )}
              <button
                onClick={() => navigate("/checkout")}
                disabled={subtotal === 0}
                className={`text-sm font-Futura-Light border-b border-white ${
                  subtotal === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-80 hover:opacity-100"
                }`}>
                {subtotal === 0 ? "All items are out of stock" : "Checkout →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
