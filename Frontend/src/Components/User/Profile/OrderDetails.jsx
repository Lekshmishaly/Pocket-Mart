import axiosInstance from "@/Utils/AxiosConfig";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function OrderDetails() {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const { order_id } = useParams();
  const [order, setOrder] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get(`/user/fetchorder/${order_id}`);
      // console.log("Fetched Order", response.data.orderData);
      setOrder(response.data.orderData);
    } catch (error) {
      console.error("Error fetching Order Details:", error);
      toast.error("Failed to fetch order details. Please try again.");
    }
  }

  async function handleOrderCancellation(itemId) {
    setItemToCancel(itemId);
    setShowConfirmation(true);
  }

  async function confirmCancellation() {
    try {
      const response = await axiosInstance.patch("/user/order/cancel", {
        order_id: order.order_id,
        itemId: itemToCancel,
      });
      setReload(true);
      setShowConfirmation(false);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error in Order Cancelling:", error);
    }
  }

  useEffect(() => {
    fetchOrderDetails();
    setReload(false);
  }, [reload]);

  return (
    <div className="bg-[#f4ede3] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate("/profile/account")}
          className="relative text-[#613220] text-sm font-Futura-Light hover:text-[#3d2a22] transition-colors duration-300 group mb-8">
          ← Return to Account details
          <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
        </button>

        {/* Order Header */}
        <div className="border-b border-[#8b5d4b]/20">
          <h1 className="text-[#b8836e] text-l font-[Satisfy] mb-2">
            {` Order ID: ${order.order_id}  |  ${order.payment_status}`}
          </h1>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 border-b border-[#8b5d4b]/20">
          {/* Date */}
          <div className="mx-auto">
            <h2 className="text-[#8b5d4b] text-sm font-semibold mb-6">Date</h2>
            <p className="text-[#b8836e] text-sm font-Futura-Light">
              {new Date(order.placed_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="mx-auto">
            <h2 className="text-[#8b5d4b] text-sm font-semibold mb-6">
              Shipping Address
            </h2>
            <div className="text-[#b8836e] text-sm font-Futura-Light mb-2">
              <p>
                {order?.shipping_address?.firstname}
                {order?.shipping_address?.lastname}
              </p>
              <p>{order?.shipping_address?.address}</p>
              <p>{order?.shipping_address?.landMark}</p>
              <p>
                {order?.shipping_address?.postalCode}{" "}
                {order?.shipping_address?.city}
              </p>
              <p>{order?.shipping_address?.country}</p>
            </div>
          </div>

          {/* Order Value */}
          <div className="mx-auto">
            <h2 className="text-[#8b5d4b] text-sm font-semibold mb-6">
              Order value
            </h2>
            <p className="text-[#b8836e] text-sm font-Futura-Light">
              INR {order.total_amount?.toLocaleString("en-IN")}.00
            </p>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-12">
          <div className="flex justify-between">
            <h2 className="text-[#8b5d4b] text-sm font-semibold mb-6">
              Items (
              {Array.isArray(order.order_items) && order.order_items.length})
            </h2>
          </div>
          <div className="grid gap-6 bg-[#eae0d3] rounded-lg p-4 sm:p-6 border border-[#d4c9bc]">
            {Array.isArray(order.order_items) &&
              order.order_items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-6 p-4 bg-[#f4ede3] rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div
                    onClick={() => {
                      navigate(`/product-Page/${item.productId._id}`);
                    }}
                    className="sm:w-32 sm:h-40 relative group">
                    <img
                      src={item.productId.images[0] || "/placeholder.svg"}
                      alt={item.productId.name}
                      className="w-full sm:w-32 h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                    <div className="space-y-3">
                      <h3
                        onClick={() => {
                          navigate(`/product-Page/${item.productId._id}`);
                        }}
                        className="text-[#9d654f] text-sm font-Futura-Light">
                        {item.productId.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          INR {item.productId.price.toLocaleString("en-IN")}.00
                        </p>
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          Quantity: {item.qty}
                        </p>
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          Order Status: {item.order_status}
                        </p>
                      </div>

                      {item.order_status !== "Cancelled" && (
                        <button
                          onClick={() => handleOrderCancellation(item._id)}
                          className="relative text-[#8b5d4b] text-sm font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                          Request cancellation
                          <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                        </button>
                      )}
                    </div>

                    <div className="hidden sm:flex items-start justify-end">
                      <p className="text-[#b8836e] text-sm font-Futura-Light">
                        Total: INR{" "}
                        {(item.productId.price * item.qty).toLocaleString(
                          "en-IN"
                        )}
                        .00
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          {/* Summary Details */}
          <div className="flex justify-between text-sm font-semibold text-[#8b5d4b] pt-4 border-t border-[#8b5d4b]/20">
            <span className="text-[#b8836e]">Subtotal</span>
            <span className="text-[#b8836e]">
              INR {order.total_amount?.toLocaleString("en-IN")}.00
            </span>
          </div>
          <div className="flex justify-between text-sm font-Futura-Light text-[#8b5d4b]">
            <span className="text-[#b8836e]">
              Shipping (Standard Prepaid Shipping)
            </span>
            <span className="text-[#b8836e]">INR 0.00</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#8b5d4b] pt-4 border-t border-[#8b5d4b]/20">
            <span className="text-[#b8836e]">Total</span>
            <span className="text-[#b8836e]">
              INR {order.total_amount?.toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#d0c4b5] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-[#8b5d4b] text-lg font-semibold mb-4">
              Confirm Cancellation
            </h2>
            <p className="text-[#b8836e] mb-6">
              Are you sure you want to cancel this item?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-[#ece3d9] text-[#8b5d4b] rounded hover:bg-[#e8dac8] transition-colors duration-200">
                No, Keep Item
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-[#955238] text-white rounded hover:bg-[#713d28] transition-colors duration-200">
                Yes, Cancel Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
