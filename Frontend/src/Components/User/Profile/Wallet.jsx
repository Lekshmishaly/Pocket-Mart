import React, { useEffect, useState } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { addMoneytoWalletApi, fetchWalletInfoApi } from "@/APIs/Wallet";
import Pagination from "@/Utils/Pagination";

function Wallet() {
  const userData = useSelector((store) => store.user.userDetails);

  const [reload, setReload] = useState(false);
  // cart
  const [cart, setCart] = useState({});
  //total balance
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //Entered amount in the add amount popup
  const [amount, setAmount] = useState(0);
  //transaction array
  const [transactions, setTransactions] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  ////////////////////////////// handle add Money //////////////////////////////

  const handleAddMoney = async () => {
    try {
      if (amount > 50000) {
        return toast.error("You cannot add money above 50000 at a time");
      } else if (amount < 0) {
        return toast.error("Negative values are not accepted");
      }

      const response = await addMoneytoWalletApi(amount, userData._id);
      setReload(true);
      setIsModalOpen(false);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  //////////////////////////////// fetch Wallet ////////////////////////////////

  async function fetchWalletInfo(page = 1) {
    try {
      const response = await fetchWalletInfoApi(userData._id, page, limit);
      const { balance, transactions, totalTransactionCount } =
        response.data.myWallet;

      setBalance(balance);
      setTransactions(transactions);

      const total = Math.ceil(totalTransactionCount / limit); // 👈 Calculate total pages
      setTotalPages(total); // 👈 Set total pages
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  useEffect(() => {
    fetchWalletInfo(currentPage);
    setReload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reload, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-[#8b5d4b] ">
            My Wallet
          </h1>
        </div>

        <div className="bg-[#f4ede3] rounded-lg border border-gray-300 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-[#8b5d4b] mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold text-[#93624c]">
                ₹{balance.toFixed(2)}
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#955238] hover:bg-[#713d28] text-white transition-colors px-6 py-2.5 rounded-lg  font-Futura-Light font-thin text-sm flex items-center gap-2">
              <Plus size={20} />
              Add Money
            </button>
          </div>
        </div>

        <div className="bg-[#f4ede3] rounded-lg border border-gray-300 shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-[#ad6447] ">
              Transaction History
            </h2>
          </div>
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === "credit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}>
                    {transaction.transaction_type === "credit" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#8b5d4b]">
                      {transaction.transaction_type === "credit"
                        ? "Money Added"
                        : "Payment"}
                    </p>
                    <p className="text-sm text-[#8b5d4b]">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-full text-center ${
                        transaction.transaction_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.transaction_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {transaction.transaction_status}
                    </span>
                  </div>
                  <p
                    className={`text-lg font-semibold w-28 text-right ${
                      transaction.transaction_type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {transaction.transaction_type === "credit" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#8b5d4b]">
                  Add Money to Wallet
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#8b5d4b] hover:text-[#8b5d4b]">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-[#8b5d4b] mb-2">
                  Enter Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="₹0.00"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <button
                onClick={handleAddMoney}
                className="w-full bg-[#955238] hover:bg-[#713d28] text-white transition-colors px-4 py-2.5 rounded-lg">
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <CheckOut deductMoney={handleDeductMoney} /> */}
    </div>
  );
}

export default Wallet;
