import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotebookPen, Plus } from "lucide-react";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCategoryOfferApi, removeOffer } from "@/APIs/Products/Offers";
import Pagination from "@/Utils/Pagination";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [reload, setReload] = useState(false);
  const [offers, setOffers] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  /////////////////////////////////////// fetch Category //////////////////////////////

  async function fetchCategory(page = 1) {
    try {
      const response = await axiosInstance.get(
        `/admin/categories?page=${page}&limit=6`
      );
      setCategories(response.data.categoryData);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }
  /////////////////////////////////////// handle Category Status //////////////////////////////

  async function handleCategoryStatus(_id, isActive) {
    try {
      const response = await axiosInstance.patch(
        "/admin/category/toogle-status",
        {
          _id,
          isActive,
        }
      );
      toast.success(response.data.message);
      setReload(true);
      setToggle(!toggle);
    } catch (error) {
      console.log(error);
      if (error.response) {
        return toast.error(error.response.data.message);
      }
    }
  }

  /////////// handle Category Edit ///////////

  function handleCategoryEdit(_id) {
    navigate(`/admin/edit-categories/${_id}`);
  }

  /////////////////////////////////////// fetch Category Offer //////////////////////////////

  async function fetchCategoryOffer() {
    try {
      const response = await fetchCategoryOfferApi();
      setOffers(response.data.categoryOffer);
    } catch (error) {
      console.log(error);
    }
  }

  //////////////////////////////////// handleRemoveOffer /////////////////////////////////

  async function handleRemoveOffer(id) {
    try {
      const response = await removeOffer(id);
      toast.success(response.data.message);
      setReload(true);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchCategory(currentPage);
    fetchCategoryOffer();
    setReload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reload, currentPage]);

  return (
    <div className="bg-[#f5f5f5] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
              Categories
            </h1>
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <span
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-900 hover:text-gray-600 cursor-pointer">
                Dashboard
              </span>
              <span className="text-gray-500">&gt;</span>
              <span className="text-gray-500">Categories</span>
            </nav>
          </div>
          <Button
            className="bg-[#e07d6a] hover:bg-[#9c4f3f] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-fit"
            onClick={() => navigate("/admin/add-category")}>
            <Plus className="h-5 w-5" />
            Add Category
          </Button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] whitespace-nowrap">
                  Category Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Added</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Offers</TableHead>
                <TableHead className="whitespace-nowrap">Figure</TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id} className="text-sm">
                    <TableCell className="font-medium break-words max-w-[140px] sm:max-w-full">
                      {category.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={category.isActive}
                          onChange={() =>
                            handleCategoryStatus(
                              category._id,
                              category.isActive
                            )
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#e07d6a]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e07d6a]"></div>
                      </label>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {offers.some(
                        (offer) => offer.target_id === category._id
                      ) ? (
                        <button
                          className="border rounded py-1 px-2 text-purple-700 hover:bg-[#efdbf3]"
                          onClick={() => handleRemoveOffer(category._id)}>
                          Clear Offer
                        </button>
                      ) : (
                        <button
                          className="border rounded py-1 px-2 text-[#e07d6a] hover:bg-[#ead8d4]"
                          onClick={() =>
                            navigate(
                              `/admin/category-offer/${category._id}/${category.name}`
                            )
                          }>
                          Add Offer
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {offers.find((offer) => offer.target_id === category._id)
                        ?.discountValue ? (
                        <span>
                          {
                            offers.find(
                              (offer) => offer.target_id === category._id
                            )?.discountValue
                          }
                          % OFF
                        </span>
                      ) : (
                        <span>0% OFF</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <button
                        className="text-gray-600 hover:text-[#e07d6a] transition-colors p-1"
                        onClick={() => handleCategoryEdit(category._id)}
                        title="Edit">
                        <NotebookPen className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
  );
}
