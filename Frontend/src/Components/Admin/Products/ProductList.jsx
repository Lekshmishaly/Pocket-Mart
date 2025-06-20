import { useEffect, useState } from "react";
import { NotebookPen, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { button } from "@heroui/theme";
import { fetchProductOfferApi, removeOffer } from "@/APIs/Products/Offers";
import Pagination from "@/Utils/Pagination";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [reload, setReload] = useState(false);
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  //////////////////////////////////// fetch Products ////////////////////////////////

  async function fetchProducts(page = 1) {
    try {
      const response = await axiosInstance.get(
        `/admin/products?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      setProducts(response.data.ProductsData);
      setTotalPages(response.data.totalPages); // backend should return this
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }

  //////////////////////////////////// handle Product Status ////////////////////////////////

  async function handleProductStatus(_id, isActive) {
    try {
      const response = await axiosInstance.patch(
        "/admin/product/toogle-status",
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

  /////////////////////////////////////// fetch Product Offer //////////////////////////////

  async function fetchProductOffer() {
    try {
      const response = await fetchProductOfferApi();
      setOffers(response.data.productOffer);
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
    fetchProducts(currentPage);
    fetchProductOffer();
    setReload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reload, currentPage]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
              Product Management
            </h1>
            <nav className="flex items-center gap-2 text-sm">
              <span
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-900 hover:text-gray-600 cursor-pointer">
                Dashboard
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">Product Management</span>
            </nav>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-auto min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e07d6a]"
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#f5f5f5] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-[#e07d6a] text-white text-left">
                  <th className="px-4 py-3 font-medium">Product Name</th>
                  <th className="px-4 py-3 font-medium">Product ID</th>
                  <th className="px-4 py-3 font-medium">QTY</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Offer</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(products) &&
                  products.map((product, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {/* Product Image */}
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-24 w-16 sm:h-28 sm:w-20 lg:h-36 lg:w-24 object-cover rounded"
                            />

                            {/* Discount Badge */}
                            {offers.find(
                              (offer) => offer.target_id === product._id
                            ) && (
                              <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 lg:top-2 lg:left-2 bg-white rounded-full px-1.5 py-[2px] text-[9px] sm:text-[10px] lg:text-[11px] font-semibold shadow-md leading-tight whitespace-nowrap">
                                {
                                  offers.find(
                                    (offer) => offer.target_id === product._id
                                  )?.discountValue
                                }
                                % OFF
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-sm sm:text-base">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 break-all text-xs sm:text-sm">
                        {product._id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.stocks}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        INR{" "}
                        {product.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.category?.name || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {offers.some(
                          (offer) => offer.target_id === product._id
                        ) ? (
                          <button
                            onClick={() => handleRemoveOffer(product._id)}
                            className="text-purple-700 border rounded px-2 py-0.5 hover:bg-[#efdbf3] text-xs sm:text-sm">
                            Clear Offer
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/product-offer/${product._id}/${product.name}`
                              )
                            }
                            className="text-[#e07d6a] border rounded px-2 py-0.5 hover:bg-[#ead8d4] text-xs sm:text-sm">
                            Add Offer
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/edit-product/${product._id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-full"
                            aria-label="Edit product">
                            <NotebookPen className="w-5 h-5 text-gray-600" />
                          </button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={product.isActive}
                              onChange={() =>
                                handleProductStatus(
                                  product._id,
                                  product.isActive
                                )
                              }
                            />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#e07d6a] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination & Add Product */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
            {totalPages > 1 && (
              <div className="w-full sm:w-auto">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
            <button
              onClick={() => navigate("/admin/add-product")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-[#e07d6a] hover:bg-[#9c4f3f] text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
