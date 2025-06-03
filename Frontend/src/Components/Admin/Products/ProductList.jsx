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

      console.log("Offers", response.data.productOffer);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-auto min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e07d6a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#f5f5f5] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#e07d6a] text-white">
                  <th className="text-left px-4 py-3 font-medium">
                    Product Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Product ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium">QTY</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Offer</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 ">
                {Array.isArray(products) &&
                  products.map((product, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 relative">
                        <div className="flex items-center gap-3 relative">
                          <div className="relative">
                            {/* Product Image */}
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-28 aspect-[3/4] object-cover rounded"
                            />

                            {/* Discount Badge - Positioned Inside Image (Top Left) */}
                            {offers.find(
                              (offer) => offer.target_id === product._id
                            ) && (
                              <div className="absolute top-1 left-0.5 bg-white px-0.5 py-0 rounded-full text-[8px] font-semibold shadow-md">
                                {
                                  offers.find(
                                    (offer) => offer.target_id === product._id
                                  )?.discountValue
                                }
                                % OFF
                              </div>
                            )}
                          </div>

                          {/* Product Name */}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product._id}</td>
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
                        {product.name}
                      </td>

                      {offers.some(
                        (offer) => offer.target_id === product._id
                      ) ? (
                        <td className="px-4 py-3 text-purple-700">
                          <div className="border rounded text-center py-0.2 px-0.4 border-gray-300 hover:bg-[#efdbf3]">
                            <button
                              onClick={() => handleRemoveOffer(product._id)}>
                              Clear Offer
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td className="px-4 py-3 text-[#e07d6a]">
                          <div className="border text-center rounded border-gray-300 hover:bg-[#ead8d4]">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/product-offer/${product._id}/${product.name}`
                                )
                              }>
                              Add Offer
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/edit-product/${product._id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#e07d6a] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e07d6a]"></div>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* Add Product Button */}
            <button
              onClick={() => navigate("/admin/add-product")}
              className="flex items-center gap-2 px-4 py-2 bg-[#e07d6a] hover:bg-[#9c4f3f] text-white rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
