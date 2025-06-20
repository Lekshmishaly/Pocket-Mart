import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";

function VerifiedModal({ isModalOpen, onExit, order }) {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      <Modal
        backdrop="blur"
        isOpen={isModalOpen}
        onClose={onExit}
        className="bg-[#ffffff] border shadow-lg rounded-lg max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center border-b py-2">
                <h1 className="text-xl font-bold text-[#733519]">
                  Order Summary
                </h1>
              </ModalHeader>
              <ModalBody className="px-4 py-3 md:px-5">
                <div className="flex flex-col items-center">
                  {order?.order_items?.[0]?.payment_status === "Pending" ||
                  order?.order_items?.[0]?.payment_status === "Paid" ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center mb-2">
                        <img
                          src="https://media.tenor.com/bm8Q6yAlsPsAAAAi/verified.gif"
                          alt="Verified"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h2 className="text-base md:text-lg font-semibold text-center mb-3">
                        {`${order.shipping_address.firstname}, Your Order is Placed.`}
                      </h2>
                    </div>
                  ) : order?.order_items?.[0]?.payment_status === "Failed" ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 flex items-center justify-center mb-2">
                        <img
                          src="https://portal.maktabsoft.ir/95136081/component/messenger/assets/images/failed.gif"
                          alt="Failed"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h2 className="text-base md:text-lg font-semibold text-center mb-3">
                        {`${order.shipping_address.firstname}, We’re sorry, your order couldn’t  be placed. Please verify your payment and try again.`}
                      </h2>
                    </div>
                  ) : null}

                  <div className="w-full overflow-x-auto rounded-lg shadow-sm border">
                    <Table
                      aria-label="Order details table"
                      className="min-w-full">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableCell className="text-green-600 font-medium py-2 pl-3 text-sm">
                            OrderId
                          </TableCell>
                          <TableCell className="text-right font-medium py-2 pr-3 text-sm">
                            {order.order_id}
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow key="1" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Date
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm">
                            {new Date(order.placed_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow key="2" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Time
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm">
                            {new Date(order.placed_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow key="3" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Payment Method
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm">
                            {order.payment_method}
                          </TableCell>
                        </TableRow>
                        <TableRow key="4" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Payment Status
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs ${
                                order?.order_items?.[0]?.payment_status ===
                                "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : order?.order_items?.[0]?.payment_status ===
                                    "Failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {order?.order_items?.[0]?.payment_status || "N/A"}
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow key="5" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Coupon Discount
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm font-[Satisfy]">
                            {order.coupon_discount}
                          </TableCell>
                        </TableRow>
                        <TableRow key="6" className="border-t hover:bg-gray-50">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Shipping Fee
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm">
                            {order.shipping_fee === 0 ? (
                              <span className="text-green-600 font-medium">
                                Free
                              </span>
                            ) : (
                              `INR ${order.shipping_fee}.00`
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          key="7"
                          className="border-t hover:bg-gray-50 font-medium">
                          <TableCell className="py-1.5 pl-3 text-sm">
                            Amount
                          </TableCell>
                          <TableCell className="text-right py-1.5 pr-3 text-sm font-bold">
                            INR{" "}
                            {Math.round(
                              order.total_price_with_discount
                            ).toLocaleString("en-IN")}
                            .00
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-3 mb-1 text-center">
                    <h1 className="text-green-700 font-bold text-sm md:text-base">
                      {`Arriving By ${new Date(
                        order.delivery_by
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                    </h1>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t pt-2 pb-2 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
                <Button
                  className="bg-[#733519] text-[#eae0d3] hover:bg-[#af562c] px-4 py-1.5 rounded-md w-full  text-sm"
                  onClick={() => navigate("/shop-page")}>
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => navigate("/profile/orderhistory")}
                  className="bg-[#eae0d3] text-[#8b5d4b] hover:bg-[#c3b7a8] px-4 py-1.5 rounded-md w-full  text-sm">
                  View Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default VerifiedModal;
