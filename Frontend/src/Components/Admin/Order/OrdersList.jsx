import axiosInstance from "@/Utils/AxiosConfig";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/Components/Admin/Shared/ConfirmationModal";

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

  async function fetchOrderDetails() {
    try {
      const response = await axiosInstance.get("/admin/order");
      console.log("Fetched Order", response.data.orderData);
      setOrders(response.data.orderData);
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

  useEffect(() => {
    fetchOrderDetails();
    setreload(false);
  }, [reload]);

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
                orders.map((order) => (
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
                        {order.shipping_address.firstname}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        ₹{order.total_amount}
                      </td>
                      <td className="px-4 py-4 text-sm">
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
                                        {/* Disabled current status */}
                                        <option
                                          value={item.order_status}
                                          disabled>
                                          {item.order_status}
                                        </option>

                                        {/* Dynamically render available options */}
                                        {getAvailableOptions(
                                          item.order_status
                                        ).map((status) => (
                                          <option key={status} value={status}>
                                            {status}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
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
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button className="px-3 py-1 rounded-md bg-[#e07d6a] text-white hover:bg-[#9c4f3f] transition-colors">
              1
            </button>
            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              2
            </button>
            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              3
            </button>
            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              »
            </button>
          </nav>
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
