import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/Components/Admin/Shared/ConfirmationModal";
import { AlertCircle, FolderX } from "lucide-react";
import { Button } from "@/Components/ui/button";
import ConfirmationModalwithButtons from "../Shared/ConfirmationModalwithButtons";
import Pagination from "@/Utils/Pagination";

function OrdersPage() {
  const [reload, setreload] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({
    orderId: null,
    itemId: null,
    newStatus: "",
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [isOpenWithButton, setIsOpenWithButton] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  //////////////////////////////// fectch order Deatils ////////////////////////////////

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get(
        `/admin/order?page=${currentPage}&limit=8`
      );
      setOrders(response.data.orderData);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching Order Details:", error);
      toast.error("Failed to fetch order details. Please try again.");
    }
  }

  async function handleStatusChange(orderId, itemId, newStatus) {
    setShowConfirmation(true);
    try {
      const response = await axiosInstance.put("/admin/order/status", {
        orderId,
        itemId,
        newStatus,
      });

      setShowConfirmation(false);
      toast.success(response.data.message);
      setreload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  const confirmStatusChange = () => {
    const { orderId, itemIndex, status } = selectedStatus;
    const newOrders = [...orders];
    const orderIndex = newOrders.findIndex((o) => o._id === orderId);
    if (orderIndex !== -1) {
      newOrders[orderIndex].order_items[itemIndex].status = status;
      setOrders(newOrders);
      toast.success(`Order status updated to ${status}`);
    }
    setShowConfirmation(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Shipped":
        return "bg-blue-200 text-blue-800";
      case "Delivered":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      case "Returned":
        return "bg-violet-200 text-violet-800";
      case "Return Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getAvailableOptions = (currentStatus) => {
    const statusMap = {
      Pending: ["Shipped", "Delivered", "Cancelled"],
      Shipped: ["Delivered", "Cancelled"],
      Delivered: [], // No further transitions allowed
      Cancelled: [], // No further transitions allowed
    };

    return statusMap[currentStatus] || [];
  };

  async function handleReturnReq(orderId, itemId, reason, explanation) {
    setModalContent({
      title: "Return Order",
      message: (
        <div>
          <div className="flex items-baseline">
            <h2 className="text-lg font-medium text-gray-900 mr-2">Reason:</h2>
            <p className=" text-lg font-medium  text-gray-500">{reason}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-900 mr-2">
              Explanation:
            </h2>
            <p className="text-lg font-light text-gray-600 whitespace-pre-wrap">
              {explanation}
            </p>
          </div>
        </div>
      ),
      onConfirm: async () => {
        try {
          const request_status = "Approved";
          const response = await axiosInstance.patch("/admin/return/response", {
            orderId,
            itemId,
            request_status,
          });
          toast.success(response.data.message);
          setreload(true);
        } catch (err) {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
      onCancel: async () => {
        try {
          const request_status = "Rejected";
          const response = await axiosInstance.patch("/admin/return/response", {
            orderId,
            itemId,
            request_status,
          });
          toast.success(response.data.message);
          setreload(true);
        } catch (err) {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpenWithButton(true);
  }

  useEffect(() => {
    fetchOrderDetails(currentPage);
    setreload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reload, currentPage]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Orders</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-[#e07d6a] cursor-pointer transition-colors">
              Dashboard
            </span>
            <span className="mx-2">›</span>
            <span className="text-[#e07d6a]">Orders</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e07d6a] focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#f5f5f5] rounded-lg overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-[#e07d6a] text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {Array.isArray(orders) &&
                orders
                  .filter(
                    (order) =>
                      Array.isArray(order.order_items) &&
                      order.order_items.some(
                        (item) => item.payment_status !== "Failed"
                      )
                  )
                  .map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {order.order_id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(order.placed_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {order.user.firstname} {order.user.lastname}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          ₹{order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {order.isReturnReq && (
                            <Button
                              onClick={() => toggleOrderExpansion(order._id)}
                              variant="ghost"
                              size="icon"
                              className="text-amber-500 hover:text-amber-600 hover:bg-amber-100 transition-colors">
                              <AlertCircle
                                size={18}
                                className={`transition-transform ${
                                  expandedOrder === order._id ? "scale-110" : ""
                                }`}
                              />
                              <span className="sr-only">
                                Toggle return request details
                              </span>
                            </Button>
                          )}
                          <button
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order._id ? null : order._id
                              )
                            }
                            className="text-[#e07d6a] hover:text-[#9c4f3f] transition-colors">
                            {expandedOrder === order._id
                              ? "Hide Details ⇧ "
                              : "Show Details ⇩ "}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Items */}
                      {expandedOrder === order._id && (
                        <tr>
                          <td colSpan="5" className="px-4 py-4">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Product Name
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Total Price
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Status
                                  </th>
                                  {order.isReturnReq && (
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                      Return
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(order.order_items) &&
                                  order.order_items.map((item, index) => (
                                    <tr
                                      key={`${order._id}-${index}`}
                                      className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {item.productId.name}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {item.qty}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        ₹{item.productId.price}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        ₹{item.total_price}
                                      </td>
                                      <td className="px-4 py-2 text-sm">
                                        <select
                                          value={item.order_status}
                                          onChange={(e) => {
                                            setSelectedStatus({
                                              orderId: order.order_id,
                                              itemId: item._id,
                                              newStatus: e.target.value,
                                            });
                                            setShowConfirmation(true);
                                          }}
                                          className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#e07d6a] focus:border-[#e07d6a] sm:text-sm ${getStatusColor(
                                            item.order_status
                                          )}`}>
                                          <option
                                            value={item.order_status}
                                            disabled>
                                            {item.order_status}
                                          </option>
                                          {getAvailableOptions(
                                            item.order_status
                                          ).map((status) => (
                                            <option key={status} value={status}>
                                              {status}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      {item.return_request &&
                                        item.return_request.status ===
                                          "Pending" && (
                                          <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm">
                                            <button
                                              onClick={() => {
                                                handleReturnReq(
                                                  order._id,
                                                  item._id,
                                                  item.return_request.reason,
                                                  item.return_request
                                                    .explanation
                                                );
                                              }}
                                              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-yellow-200 hover:scale-105 hover:bg-yellow-300">
                                              Pending Request
                                            </button>
                                          </td>
                                        )}
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
            </tbody>
          </table>
          {orders.length == 0 && (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-center">
                <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  No Orders Yet
                </h1>
              </div>
            </div>
          )}
          <ConfirmationModalwithButtons
            isOpen={isOpenWithButton}
            onOpenChange={setIsOpenWithButton}
            title="Return Request"
            message={modalContent.message}
            confirmText="Accept"
            cancelText="Decline"
            onConfirm={modalContent.onConfirm}
            onCancel={modalContent.onCancel}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() =>
          handleStatusChange(
            selectedStatus.orderId,
            selectedStatus.itemId,
            selectedStatus.newStatus
          )
        }
        message={`Are you sure you want to change the status to ${selectedStatus.newStatus}?`}
      />
    </div>
  );
}
export default OrdersPage;
