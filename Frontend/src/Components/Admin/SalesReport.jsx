import axiosInstance from "@/Utils/AxiosConfig";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { saveAs } from "file-saver";
import Pagination from "@/Utils/Pagination";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("daily");
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  /////////////////////////////////////////// handle pdf Downloader //////////////////////////////////////////

  const handlePdfDownload = async () => {
    try {
      const response = await axiosInstance.get("admin/sales/download/pdf", {
        params: { filterType, startDate, endDate },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "SalesReport.pdf");
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  /////////////////////////////////////////// handle Excel Downloader //////////////////////////////////////////

  const handleExcelDownload = async () => {
    try {
      const response = await axiosInstance.get("admin/sales/download/excel", {
        params: { filterType, startDate, endDate },
        responseType: "blob",
      });
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // correct MIME type
        });
        saveAs(blob, "SalesReport.xlsx");
      } else {
        console.error("Failed to download Excel: No data available.");
      }
    } catch (error) {
      console.error("Failed to download Excel:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get(
        `/admin/sales?page=${currentPage}&limit=${limit}`,
        {
          params: {
            filterType,
            startDate,
            endDate,
          },
        }
      );
      const data = await response.data.orders;
      const totalsaleData = await response.data.totalSales;

      setOrders(data);
      setTotalSales(totalsaleData);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    };

    fetchOrders();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [startDate, endDate, filterType, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        {filterType == "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const currentDate = new Date();

                if (selectedDate > currentDate) {
                  toast.error("Select a past date");
                } else {
                  setStartDate(e.target.value);
                }
              }}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                const selectedEndDate = new Date(e.target.value);
                const start = new Date(startDate);

                if (selectedEndDate < start) {
                  toast.error("End date cannot be earlier than the start date");
                } else {
                  setEndDate(e.target.value);
                }
              }}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </>
        )}

        <div className="flex gap-2">
          {["custom", "daily", "weekly", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded ${
                filterType === type
                  ? "bg-[#982c19] text-white"
                  : "bg-gray-200 text-black"
              }`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <span className="ml-auto">
          <b> Total {filterType} sales :</b> ₹
          {totalSales.toLocaleString("en-IN")}.00
        </span>
      </div>

      {orders.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#e07d6a] text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Order Date</th>
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Unit Price</th>
                  <th className="py-3 px-6 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm font-normal">
                {orders.map((order) =>
                  order.order_items.map((item, index) => (
                    <tr
                      key={`${order._id}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {index === 0
                          ? `${
                              order?.user?.firstname ||
                              order?.shipping_address?.firstname ||
                              ""
                            } ${
                              order?.user?.lastname ||
                              order?.shipping_address?.lastname ||
                              ""
                            }`
                          : ""}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {index === 0
                          ? new Date(order.placed_at).toLocaleDateString(
                              "en-GB"
                            )
                          : ""}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {item.productId.name}
                      </td>
                      <td className="py-3 px-6 text-left">{item.qty}</td>
                      <td className="py-3 px-6 text-left">
                        ₹ {item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-left">
                        ₹ {(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end space-x-4 p-4">
            <button
              onClick={handleExcelDownload}
              className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Download Excel
            </button>
            <button
              onClick={handlePdfDownload}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Download PDF
            </button>
          </div>
        </div>
      )}
      {!orders.length && (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Sales Data
          </h2>
          <p className="text-gray-600 text-center">
            There are currently no sales records to display for the selected
            period.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your date range or check back later for new sales
            data.
          </p>
        </div>
      )}
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
  );
};

export default SalesReport;
