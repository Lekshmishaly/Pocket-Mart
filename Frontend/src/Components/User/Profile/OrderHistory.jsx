import PaymentComponent from "@/Components/ui/PaymentComponent";
import axiosInstance from "@/Utils/AxiosConfig";
import Pagination from "@/Utils/Pagination";
import { button } from "@heroui/theme";
import { PackageX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const userData = useSelector((store) => store.user.userDetails);
  const [orders, setOrders] = useState([]);
  const [reload, setReload] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  ////////////////////////////////// fetch Order //////////////////////////////////

  async function fetchOrder(page = 1) {
    try {
      const response = await axiosInstance.get(
        `/user/fetchorders/${userData._id}?page=${page}&limit=4`
      );

      setOrders(response.data.orderDetails);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching Order:", error);
    }
  }

  //////////////////////////////////// handle Payment Success/////////////////////////////

  function handlePaymentSuccess(orderId) {
    axiosInstance
      .put(`/user/order-success/${orderId}`)
      .then((response) => {
        setReload(true);
      })
      .catch((error) => {
        console.error("Error in order-success API:", error);
      });
  }

  useEffect(() => {
    fetchOrder(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setReload(false);
  }, [currentPage, reload]);
  return (
    <div className="bg-[#f4ede3] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#8b5d4b] text-xl mb-8 font-light">
          Order history
        </h2>

        {/* 👉 Mobile View */}
        <div className="block sm:hidden space-y-6 text-[11px]">
          {Array.isArray(orders) &&
            orders.map((order, index) => (
              <div
                key={index}
                className="border-b border-[#8b5d4b] pb-4 space-y-2 px-2">
                <div className="flex justify-between items-center">
                  <span className="font-Futura-Light text-[#b55029] text-[10px]">
                    DATE
                  </span>
                  <span className="text-[#8b5d4b] text-[11px]">
                    {new Date(order.placed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-Futura-Light text-[#b55029] text-[10px]">
                    ORDER
                  </span>
                  <span className="text-[#8b5d4b] text-[11px]">
                    #{order.order_id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-Futura-Light text-[#b55029] text-[10px]">
                    TOTAL
                  </span>
                  <span className="text-[#8b5d4b] text-[11px]">
                    INR{" "}
                    {Math.round(order.total_price_with_discount).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-Futura-Light text-[#b55029] text-[10px]">
                    PAYMENT STATUS
                  </span>
                  <span className="text-[#8b5d4b] capitalize text-[11px]">
                    {order.order_items[0]?.payment_status}
                  </span>
                </div>

                {order.order_items[0]?.payment_status === "Failed" && (
                  <div className="mt-2">
                    <PaymentComponent
                      amount={order.total_amount}
                      address={order.shipping_address}
                      onSuccess={() => handlePaymentSuccess(order.order_id)}
                      title="Retry Payment"
                      className="!text-xs !py-1 !px-3"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center mt-1">
                  <span className="font-Futura-Light text-[#b55029] text-[10px]">
                    FULFILLMENT STATUS
                  </span>
                  <button
                    onClick={() =>
                      navigate(`/profile/orderDetails/${order.order_id}`)
                    }
                    className="text-[#8b5d4b] font-Futura-Light underline underline-offset-4 text-[11px]">
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* 👉 Table view for larger screens */}
        {orders.length !== 0 && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#8b5d4b]/20">
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Date
                  </th>
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Order ID
                  </th>
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Order value
                  </th>
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Products
                  </th>
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Status
                  </th>
                  <th className="text-right py-4 text-sm font-Futura-Light text-[#8b5d4b]"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="border-b border-[#8b5d4b]/20">
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 whitespace-nowrap">
                      {new Date(order.placed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 whitespace-nowrap">
                      {order.order_id}
                    </td>
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 whitespace-nowrap">
                      INR{" "}
                      {Math.round(
                        order.total_price_with_discount
                      ).toLocaleString("en-IN")}
                      .00
                    </td>
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 whitespace-nowrap">
                      {order.order_items.length}
                    </td>
                    <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 whitespace-nowrap">
                      {order.order_items[0]?.payment_status}
                    </td>

                    <td className="py-4 pr-4">
                      {order.order_items[0]?.payment_status === "Failed" && (
                        <PaymentComponent
                          amount={order.total_amount}
                          address={order.shipping_address}
                          onSuccess={() => handlePaymentSuccess(order.order_id)}
                          title="Retry Payment"
                        />
                      )}
                    </td>

                    <td className="py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(`/profile/orderDetails/${order.order_id}`)
                        }
                        className="relative text-[#8b5d4b] text-sm font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                        View Details
                        <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg mt-10">
            <PackageX
              className="w-12 h-12 mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            You haven't placed any orders yet.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
