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
    <div>
      <Modal
        backdrop="blur"
        isOpen={isModalOpen}
        onClose={onExit}
        className="bg-[#ffffff] border shadow-lg ">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mx-auto">Order Summary</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <img
                    src="https://media.tenor.com/bm8Q6yAlsPsAAAAi/verified.gif"
                    alt=""
                  />

                  <h2 className="flex">{`${order.shipping_address.firstname}, Your Order is Placed.`}</h2>

                  <Table
                    aria-label="Example static collection table"
                    className="my-7">
                    <TableHeader>
                      <td className="text-green-500 ">OrderId</td>
                      <td className="text-right ">{order.order_id}</td>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Date</TableCell>
                        <TableCell className="text-right">
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
                      <TableRow key="2">
                        <TableCell>Time</TableCell>
                        <TableCell className="text-right">
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
                      <TableRow key="3">
                        <TableCell>Payment Method</TableCell>
                        <TableCell className="text-right">
                          {order.payment_method}
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Payment Status</TableCell>
                        <TableCell className="text-right ">
                          {order.payment_status}
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Shipping Address</TableCell>
                        <TableCell className="text-right font-[Satisfy]">
                          {order.shipping_address.address},{" "}
                          {order.shipping_address.city}
                        </TableCell>
                      </TableRow>

                      {/* <TableCell>Coupon Discount</TableCell> */}
                      {/* <TableCell className="text-right">
                        -INR 3289634.00
                      </TableCell> */}
                      {/* Conditional Rendering for Total Savings */}
                      {/* <TableRow key="6">
                        <TableCell>Total Savings</TableCell>
                        <TableCell className="text-right">
                          -INR 8734985.00
                        </TableCell>
                      </TableRow> */}
                      {/* Display 'Free' if shipping_fee is 0 */}
                      <TableRow key="7">
                        <TableCell>Shipping Fee</TableCell>
                        <TableCell className="text-right">
                          {order.shipping_fee}
                        </TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>Amount</TableCell>
                        <TableCell className="text-right">
                          INR {order.total_amount}.00
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h1 className="text-green-700 font-bold">
                    {`Arriving By  ${new Date(
                      order.delivery_by
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`}
                  </h1>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#733519] text-[#eae0d3]"
                  onPress={onExit}>
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => navigate("/profile/orderhistory")}
                  className="bg-[#eae0d3] text-[#8b5d4b] hover:bg-[#c3b7a8]">
                  {" "}
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
