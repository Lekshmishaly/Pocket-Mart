import axiosInstance from "@/Utils/AxiosConfig";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/Redux/Slice/UserSlice";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { AlertDialog } from "./Shared/AlertDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/Utils/Pagination";

export default function ConsumersList() {
  const userData = useSelector((store) => store.user.userDetails);
  const [customers, setCustomers] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [reload, setReload] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /////////////////////////////////// fetch Customers //////////////////////////////

  async function fetchCustomers(page = 1) {
    try {
      const response = await axiosInstance.get(
        `/admin/customerList?page=${page}&limit=6`
      );
      setCustomers(response.data.userDetails);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching consumer data:", error);
    }
  }

  async function handleConsumerStatus(_id, isActive) {
    try {
      const response = await axiosInstance.patch(
        "/admin/customer/toogle-status",
        {
          _id,
          isActive,
        }
      );

      toast.success(response.data.message);
      setReload(true);
      setToggle(!toggle);
      dispatch(logoutUser());
    } catch (error) {
      console.log(error);
      if (error.response) {
        return toast.error(error.response.data.message);
      }
    }
  }

  const handleBlockClick = (customer) => {
    setSelectedCustomer(customer);
    setShowConfirmDialog(true);
  };

  const handleConfirmBlock = () => {
    if (selectedCustomer) {
      handleConsumerStatus(selectedCustomer._id, selectedCustomer.isActive);
    }
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    fetchCustomers(currentPage);
    setReload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reload, currentPage]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Customer List
            </h1>
            <nav className="flex items-center gap-2 text-sm">
              <span
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-900 hover:text-gray-600 cursor-pointer">
                Dashboard
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">Users</span>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-auto min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e07d6a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Consumers Table */}
        <div className="bg-[#f5f5f5] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#e07d6a] hover:bg-[#e07d6a]">
                  <TableHead className="text-left text-white font-medium">
                    ID
                  </TableHead>
                  <TableHead className="text-left text-white font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-white font-medium">
                    E-mail
                  </TableHead>
                  <TableHead className="text-left text-white font-medium">
                    Phone
                  </TableHead>
                  <TableHead className="text-left text-white font-medium">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((consumer, index) => (
                  <TableRow
                    key={index}
                    className="bg-white hover:bg-gray-50 transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                        <span className="text-gray-600">{consumer._id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {consumer.firstname}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {consumer.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {consumer.phone}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleBlockClick(consumer)}
                        className={`px-4 py-1 rounded border ${
                          consumer.isActive
                            ? "border-red-500 text-red-600 hover:bg-red-600 hover:text-white"
                            : "border-[#e07d6a] text-green-600 hover:bg-green-600 hover:text-white"
                        } transition-colors`}>
                        {consumer.isActive ? "BLOCK" : "UNBLOCK"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmBlock}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedCustomer?.isActive ? "block" : "unblock"
        } this user? This action can be reversed later.`}
      />
    </div>
  );
}
