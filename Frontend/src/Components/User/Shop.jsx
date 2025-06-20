import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "@/Utils/AxiosConfig";
import { Plus, Minus, X, PackageX } from "lucide-react";
import { Button } from "../ui/button";
import Pagination from "@/Utils/Pagination";

export default function Shop({ search }) {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filter, setFilter] = useState({
    categories: [],
    sleeves: [],
    price: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [tempSortBy, setTempSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 0;

  const toggleSelection = (array, value) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  /////////////////////////////////////////////////////////// fetch Products //////////////////////////////////////////////////////

  async function fetchProducts(page = 1) {
    try {
      const endpoint = search
        ? `/user/fetchproductdetails/${limit}/${search}`
        : `/user/fetchproductdetails/${limit}`;

      const response = await axiosInstance.post(
        `${endpoint}?page=${page}&limits=9`,
        { filter, sortBy }
      );

      setProducts(response.data.ProductsData);
      setMaxPrice(response.data.maxPrice);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      setProducts([]);
      if (error.response) console.log(error.response.data.message);
    }
  }

  // Category Fetch

  async function categoryFetch() {
    try {
      const response = await axiosInstance.get("/user/category");
      setCategories(response.data.categoryData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchProducts(currentPage);
    categoryFetch();
    setReload(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, reload, currentPage]);

  const handleSortChange = (value) => {
    setTempSortBy(value);
    setSortBy(value);
  };

  return (
    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 mt-32 pb-7 bg-[#f4ede3]">
      {/* Header */}
      <div className="flex justify-between mx-4 py-6 items-center ">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsSortOpen(false);
          }}
          className="flex items-center text-[#8b5d4b] hover:text-[#6d483a] transition-colors">
          <span className="mr-2 font-Futura-Light">FILTER</span>
          <Plus className="h-4 w-4 text-[#8b5d4b]" />
        </button>
        <button
          onClick={() => {
            setIsSortOpen(!isSortOpen);
            setIsFilterOpen(false);
          }}
          className="flex items-center text-[#8b5d4b] hover:text-[#6d483a] transition-colors">
          <span className="mr-2 font-Futura-Light">SORT BY</span>
          <Plus className="h-4 w-4 text-[#8b5d4b]" />
        </button>
      </div>

      <div className="flex relative">
        {/* Filter Sidebar */}
        <div
          className={`fixed mt-32 inset-y-0 left-0 z-40 w-full xs:w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4 bg-[#faf5f0] p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <button
            className="absolute top-4 right-4 text-[#8b5d4b] hover:text-[#6d483a]"
            onClick={() => setIsFilterOpen(false)}>
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-[#93624c] text-xl font-[Satisfy] mb-6">FILTER</h2>
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "category" ? null : "category"
                  )
                }
                className="w-full text-left text-[#93624c] text-l font-[Satisfy] hover:text-[#6d483a] transition-colors flex justify-between items-center">
                Category
                {expandedSection === "category" ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
              {expandedSection === "category" && (
                <div className="mt-3 space-y-2 pl-4">
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center space-x-2 text-[#93624c] text-sm font-Futura-Light">
                        <input
                          type="checkbox"
                          value={category.name}
                          checked={filter.categories.includes(category.name)}
                          onChange={(e) =>
                            setFilter((prev) => ({
                              ...prev,
                              categories: toggleSelection(
                                prev.categories,
                                e.target.value
                              ),
                            }))
                          }
                          className="form-checkbox text-[#8b5d4b]"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* Sleeve Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "sleeve" ? null : "sleeve"
                  )
                }
                className="w-full text-left text-[#93624c] text-l font-[Satisfy] hover:text-[#6d483a] transition-colors flex justify-between items-center">
                Sleeve
                {expandedSection === "sleeve" ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
              {expandedSection === "sleeve" && (
                <div className="mt-3 space-y-2 pl-4">
                  {[
                    "Short Sleeve",
                    "Sleeveless",
                    "Half Sleeve",
                    "Full Sleeve",
                  ].map((sleeve) => (
                    <label
                      key={sleeve}
                      className="flex items-center space-x-2 text-[#93624c] text-sm font-Futura-Light">
                      <input
                        type="checkbox"
                        value={sleeve}
                        checked={filter.sleeves.includes(sleeve)}
                        onChange={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            sleeves: toggleSelection(
                              prev.sleeves,
                              e.target.value
                            ),
                          }))
                        }
                        className="form-checkbox text-[#8b5d4b]"
                      />
                      <span>{sleeve}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "price" ? null : "price"
                  )
                }
                className="w-full text-left text-[#93624c] text-l font-[Satisfy] hover:text-[#6d483a] transition-colors flex justify-between items-center">
                Price
                {expandedSection === "price" ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
              {expandedSection === "price" && (
                <div className="mt-3 pl-4">
                  <div className="flex justify-between text-[#93624c] text-sm font-Futura-Light">
                    <span>₹0</span>
                    <span>₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    className="w-full mt-2 accent-[#8b5d4b]"
                    value={filter.price}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                  <div className="text-center text-[#93624c] text-sm font-Futura-Light mt-2">
                    Selected Price: ₹{filter.price}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setFilter({ categories: [], sleeves: [], price: 0 });
                  setIsFilterOpen(false);
                  setReload(true);
                }}
                className="flex-1 py-2 px-4 border border-[#8b5d4b] text-[#93624c] hover:bg-[#8b5d4b] hover:text-white transition-colors text-sm font-Futura-Light">
                CLEAR ALL
              </button>
              <button
                onClick={() => {
                  fetchProducts();
                  setIsFilterOpen(false);
                }}
                className="flex-1 py-2 px-4 border border-[#8b5d4b] text-[#93624c] hover:bg-[#8b5d4b] hover:text-white transition-colors text-sm font-Futura-Light">
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>

        {/* Sort Panel */}
        <div
          className={`fixed mt-32 inset-y-0 right-0 z-40 w-full sm:w-4/5 md:w-3/5 lg:w-1/3 xl:w-1/4 bg-[#faf5f0] p-4 sm:p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isSortOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          <button
            className="absolute top-4 right-4 text-[#8b5d4b] hover:text-[#6d483a]"
            onClick={() => setIsSortOpen(false)}>
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-[#93624c] text-xl font-[Satisfy] mb-6">
            SORT BY
          </h2>

          <div className="space-y-4">
            {[
              { value: "newest", label: "Newest" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "name_asc", label: "Name: aA - zZ" },
              { value: "name_desc", label: "Name: zZ - aA" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left py-2 px-4 text-[#93624c] hover:bg-[#8b5d4b] hover:text-white transition-colors text-sm font-Futura-Light ${
                  tempSortBy === option.value ? "bg-[#8b5d4b] text-white" : ""
                }`}>
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={() => {
                setSortBy(tempSortBy);
                setIsSortOpen(false);
                setReload(true);
              }}
              className="w-full py-2 px-4 border border-[#8b5d4b] text-[#93624c] hover:bg-[#8b5d4b] hover:text-white transition-colors text-sm font-Futura-Light">
              APPLY SORT
            </button>

            <button
              onClick={() => {
                setTempSortBy("");
                setSortBy("");
                setIsSortOpen(false);
                setReload(true);
              }}
              className="w-full py-2 px-4 border border-[#8b5d4b] text-[#93624c] hover:bg-[#8b5d4b] hover:text-white transition-colors text-sm font-Futura-Light">
              NO SORT
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full transition-all duration-300 ease-in-out">
          <div
            className="grid grid-cols-2 
                  [@media(min-width:768px)]:grid-cols-3 
                  gap-6 xl:gap-8 2xl:gap-10">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg">
                <PackageX
                  className="w-12 h-12 mb-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Product not found
              </div>
            )}
          </div>
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
  );
}
