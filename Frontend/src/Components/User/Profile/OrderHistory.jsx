import axiosInstance from "@/Utils/AxiosConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const userData = useSelector((store) => store.user.userDetails);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  ////////////////////////////////// fetch Order //////////////////////////////////

  async function fetchOrder() {
    try {
      const response = await axiosInstance.get(
        `/user/fetchorders/${userData._id}`
      );

      // console.log("order::::::::>", response.data.orderDetails);
      setOrders(response.data.orderDetails);
    } catch (error) {
      console.error("Error fetching Order:", error);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

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
                    Status
                  </th>
                  <th className="text-right py-4 text-sm font-Futura-Light text-[#8b5d4b]"></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) &&
                  orders.map((order) => (
                    <tr className="border-b border-[#8b5d4b]/20">
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
                        INR {order.total_amount.toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-Futura-Light text-[#8b5d4b] pr-4">
                        {order.payment_status}
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
          <p className="text-[#8b5d4b] text-sm font-Futura-Light">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
