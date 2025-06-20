import axiosInstance from "@/Utils/AxiosConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import OrderReturn from "../Shared/orderReturn";

function OrderDetails() {
  const userData = useSelector((store) => store.user.userDetails);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const { order_id } = useParams();
  const [order, setOrder] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderID, setOrderID] = useState(null);
  /////////////////////////////////////////// fetch Order Details /////////////////////////////////////////

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get(`/user/fetchorder/${order_id}`);

      setOrder(response.data.orderData);
    } catch (error) {
      console.error("Error fetching Order Details:", error);
      toast.error("Failed to fetch order details. Please try again.");
    }
  }

  async function handleOrderCancellation(itemId) {
    setItemToCancel(itemId);
    setShowReasonPopup(true);
  }

  async function proceedToConfirmation() {
    setShowReasonPopup(false);
    toast.success("Your response has been recorded. Thank you!");
    setShowConfirmation(true);
  }

  /////////////////////////////////////////// confirm Cancellation /////////////////////////////////////////

  async function confirmCancellation() {
    if (!order?.order_id || !itemToCancel || !selectedReason) {
      toast.error("Invalid cancellation request. Please try again.");
      return;
    }

    try {
      const response = await axiosInstance.patch("/user/order/cancel", {
        userId: userData._id,
        order_id: order.order_id,
        itemId: itemToCancel,
        reason: selectedReason,
      });

      setReload(true);
      setShowConfirmation(false);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error in Order Cancelling:", error);
      toast.error(
        error.response?.data?.message ||
          "Cancellation failed. Please try again."
      );
    }
  }

  /////////////////////////////////////////// handle Return Confirm /////////////////////////////////////////

  async function handleReturnConfirm(reason, explanation, itemId, orderID) {
    try {
      // Register return request
      const response = await axiosInstance.post("/user/return/request", {
        reason,
        explanation,
        orderID,
        itemId,
      });

      toast.success(response.data.message);

      setReload(true); // ✅ This triggers useEffect to refetch data
      setShowReturnPopup(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  }

  /////////////////////////////////////// Download Invoice ////////////////////////////////////

  const handleDownloadInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/user/invoice/${order._id}`, {
        responseType: "blob", // Important for binary file
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Invoice.pdf";
      link.click();
    } catch (err) {
      console.error("Error downloading invoice:", err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    setReload(false);
  }, [reload]);
  return (
    <div className="bg-[#f4ede3] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-8">
          {/* Return Link on Left */}
          <button
            onClick={() => navigate("/profile/account")}
            className="relative text-[#613220] text-xs sm:text-sm font-Futura-Light hover:text-[#3d2a22] transition-colors duration-300 group w-fit">
            ← Return to Account details
            <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
          </button>

          {/* Download Invoice Button on Right */}
          <button className="w-full sm:w-fit bg-[#aa6246] px-6 py-2 rounded-lg text-xs sm:text-sm text-[#f4ede3] font-Futura-Light hover:bg-[#8b5d4b]">
            Download Invoice
          </button>
        </div>

        {/* Order Header */}
        <div className="border-b border-[#8b5d4b]/20 pb-1 mb-4">
          <h1 className="text-[#613220] text-sm sm:text-base font-Futura-Light">
            Order: {order?.order_id}
          </h1>
        </div>

        {/* Order Details Row with Left and Right Block */}

        <div className="flex flex-wrap justify-between gap-4 border-b border-[#8b5d4b]/20 pb-6 mb-6">
          {/* Left Column: Date + Address */}
          <div className="flex-grow text-[#1c1c1c] text-xs sm:text-sm font-Futura-Light space-y-2 min-w-[200px]">
            <div>
              <p className="font-medium text-[#b55029]">Date</p>
              <p className="text-[#8b5d4b]">
                Placed on{" "}
                {new Date(order.placed_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <div>
              <p className="font-medium text-[#b55029]">Shipping Address</p>
              <p className="text-[#8b5d4b]">
                {order?.shipping_address?.firstname}{" "}
                {order?.shipping_address?.lastname}
              </p>
              <p className="text-[#8b5d4b]">
                {order?.shipping_address?.address}
              </p>
              <p className="text-[#8b5d4b]">
                {order?.shipping_address?.landMark}
              </p>
              <p className="text-[#8b5d4b] ">
                {order?.shipping_address?.postalCode}{" "}
                {order?.shipping_address?.city}
              </p>
              <p className="text-[#8b5d4b]">
                {order?.shipping_address?.country}
              </p>
            </div>
          </div>

          {/* Right Column: Order Value */}
          <div className="flex-shrink-0 text-right text-[#1c1c1c] text-xs sm:text-sm font-Futura-Light space-y-1 min-w-[120px] self-start ml-auto">
            <p className="font-medium text-[#b55029]">Order value</p>
            <p className="text-[#8b5d4b]">
              INR{" "}
              {Math.round(order.total_price_with_discount)?.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-[#8b5d4b] text-sm font-semibold">
              Items (
              {Array.isArray(order.order_items) && order.order_items.length})
            </h2>
          </div>

          <div className="space-y-4 bg-[#eae0d3] rounded-lg p-3 sm:p-6 border border-[#d4c9bc]">
            {Array.isArray(order.order_items) &&
              order.order_items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 bg-[#f4ede3] rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Product Image */}
                  <div
                    onClick={() =>
                      navigate(`/product-Page/${item.productId._id}`)
                    }
                    className="w-full sm:w-32 h-44 sm:h-40 relative group cursor-pointer mx-auto sm:mx-0">
                    <img
                      src={item.productId.images[0] || "/placeholder.svg"}
                      alt={item.productId.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <h3
                        onClick={() =>
                          navigate(`/product-Page/${item.productId._id}`)
                        }
                        className="text-[#9d654f] text-sm font-Futura-Light cursor-pointer">
                        {item.productId.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          INR{" "}
                          {Math.round(item.productId.price).toLocaleString(
                            "en-IN"
                          )}
                          .00
                        </p>
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          Quantity: {item.qty}
                        </p>
                        <p
                          className={`text-sm font-Futura-Light ${
                            item.order_status === "Cancelled"
                              ? "text-red-500"
                              : item.order_status === "Delivered"
                              ? "text-green-500"
                              : item.order_status === "Pending"
                              ? "text-yellow-500"
                              : "text-[#b8836e]"
                          }`}>
                          Order Status: {item.order_status}
                        </p>
                      </div>

                      {/* Cancel Button */}
                      {(item.order_status === "Pending" ||
                        item.order_status === "Shipped") &&
                        item.payment_status !== "Failed" &&
                        item.payment_status !== "Refunded" &&
                        item.order_status !== "Returned" && (
                          <button
                            onClick={() => handleOrderCancellation(item._id)}
                            className="relative text-[#8b5d4b] text-sm font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                            Request cancellation
                            <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                          </button>
                        )}

                      {/* Return Status or Return Button */}
                      {item.order_status?.trim() === "Returned" ? (
                        <p className="text-green-600 text-sm font-semibold">
                          Your return request’s been Approved.
                        </p>
                      ) : item.order_status?.trim() === "Return Rejected" ? (
                        <p className="text-red-600 text-sm font-semibold">
                          Your return request’s been Rejected.
                        </p>
                      ) : item.return_request?.status === "Pending" ? (
                        <p className="text-yellow-600 text-sm font-semibold">
                          Return request is under processing
                        </p>
                      ) : item.order_status?.trim() === "Delivered" &&
                        !item.return_request?.status ? (
                        <>
                          <p className="text-red-600 text-sm font-semibold mb-1">
                            Return deadline: 7 days remaining
                          </p>
                          <button
                            onClick={() => {
                              setOrderID(order.order_id);
                              setSelectedProductId(item._id);
                              setShowReturnPopup(true);
                            }}
                            className="relative text-[#8b5d4b] text-sm font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                            Return order
                            <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                          </button>
                        </>
                      ) : null}

                      {/* Return Component */}
                      {showReturnPopup && selectedProductId && (
                        <OrderReturn
                          setShowReturnPopup={setShowReturnPopup}
                          handleReturnConfirm={handleReturnConfirm}
                          selectedProductId={selectedProductId}
                          orderID={orderID}
                        />
                      )}
                    </div>

                    {/* Total */}
                    <div className="sm:flex items-start justify-end hidden">
                      <div className="text-right">
                        <p className="text-[#b8836e] text-sm font-Futura-Light">
                          Total: INR{" "}
                          {Math.round(
                            order.total_price_with_discount * item.qty
                          ).toLocaleString("en-IN")}
                          .00
                        </p>
                        {item.discount > 0 && (
                          <p className="text-[10px] font-Futura-Light text-[#ce472c] font-semibold rounded-sm mt-1">
                            {item.discount}% off
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold text-[#8b5d4b] pt-4 border-t border-[#8b5d4b]/20">
            <span className="text-[#b8836e]">Subtotal</span>
            <span className="text-[#b8836e]">
              INR{" "}
              {Math.round(order.total_price_with_discount)?.toLocaleString(
                "en-IN"
              )}
              .00
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2 font-Futura-Light text-[#8b5d4b]">
            <span className="text-[#b8836e]">
              Shipping (Standard Prepaid Shipping)
            </span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#8b5d4b] pt-4 border-t border-[#8b5d4b]/20">
            <span className="text-[#b8836e]">Total</span>
            <span className="text-[#b8836e]">
              INR{" "}
              {Math.round(order.total_price_with_discount)?.toLocaleString(
                "en-IN"
              )}
              .00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
