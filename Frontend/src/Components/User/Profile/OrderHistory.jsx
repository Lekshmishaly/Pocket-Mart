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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  ////////////////////////////////// fetch Order //////////////////////////////////

  async function fetchOrder(page = 1) {
    try {
      console.log("User ID for fetching orders:", userData?._id);

      const response = await axiosInstance.get(
        `/user/fetchorders/${userData._id}?page=${page}&limit=4`
      );

      setOrders(response.data.orderDetails);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);

      if (response.data.orderDetails.length === 0) {
        console.log("No orders found.");
      }
    } catch (error) {
      console.error("Error fetching Order:", error);
    }
  }

  //////////////////////////////////// handle Payment Success/////////////////////////////

  function handlePaymentSuccess(orderId) {
    axiosInstance
      .put(`/user/order-success/${orderId}`)
      .then((response) => {
        console.log("Order ID sending to backend:", orderId);
        console.log("Order success response:", response.data);
      })
      .catch((error) => {
        console.error("Error in order-success API:", error);
      });
  }

  useEffect(() => {
    fetchOrder(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="bg-[#f4ede3] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#8b5d4b] text-xl mb-8 font-light">
          Order history
        </h2>

        {orders.length !== 0 && (
          <div className="overflow-x-auto">
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
                    products
                  </th>
                  <th className="text-left py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                    Status
                  </th>
                  <th className="text-right py-4 text-sm font-Futura-Light text-[#8b5d4b]"></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) &&
                  orders.map((order, index) => (
                    <tr key={index} className="border-b border-[#8b5d4b]/20">
                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                        {new Date(order.placed_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                        {order.order_id}
                      </td>

                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                        INR{" "}
                        {Math.round(
                          order.total_price_with_discount
                        ).toLocaleString("en-IN")}
                        .00
                      </td>
                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                        {order.order_items.length}
                      </td>
                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4 space-y-1">
                        {order.order_items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between">
                            <span className="capitalize">
                              {item.payment_status}
                            </span>
                            {item.payment_status === "Failed" && (
                              <PaymentComponent
                                amount={order.total_amount}
                                address={order.shipping_address} // ✅ Add this if your component expects it
                                onSuccess={() =>
                                  handlePaymentSuccess(order.order_id)
                                }
                                title="Retry Payment"
                              />
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="py-4 text-right">
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
          <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg">
            <PackageX
              className="w-12 h-12 mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            You haven't placed any orders yet.
          </div>
        )}
      </div>
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
