import { useEffect, useState } from "react";
import axiosInstance from "@/Utils/AxiosConfig";
import { ImagePlus } from "lucide-react";
import CropperModal from "../Shared/CropperModal";
import handleCloudinaryUpload from "@/Utils/handleCloudinaryUpload";

import closeIcon from "../../../assets/close.png";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { validateEditProduct } from "@/Utils/ValidationFunctions";

export default function EditProduct() {
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImage, setMainImage] = useState("");
  //states
  const [isLoading, setIsLoading] = useState(false);
  // const [name, setName] = useState("");
  // const [price, setPrice] = useState("");
  // const [description, setDescription] = useState("");
  // const [additionalInfo, setAdditionalInfo] = useState("");
  // const [category, setCategory] = useState("");
  // const [sleeve, setSleeve] = useState("");

  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState({});

  const sleeveTypes = [
    "Full Sleeve",
    "Half Sleeve",
    "Sleeveless",
    "Short Sleeve",
  ];
  const [sizes, setSizes] = useState([
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ]);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  ///////////////////////////////////////// update product /////////////////////////////////////

  async function handleUpdateProduct() {
    const validate = validateEditProduct(
      product.name,
      product.price,
      product.description,
      product.additionalInfo,
      imageFiles,
      product.images,
      product.category,
      product.sleeve,
      setError
    );
    if (validate) {
      setIsLoading(true);
      try {
        let images;
        if (imageFiles.length > 0) {
          images = await handleCloudinaryUpload(mainImage, imageFiles);
        }
        const response = await axiosInstance.put("/admin/product", {
          product,
          images,
        });
        toast.success(response.data.message);
        setIsLoading(false);
        navigate("/admin/productList");
      } catch (err) {
        console.log(err);

        if (err.response) {
          toast.error(err.response.data.message);
          return;
        }
        console.log(err);
      }
    }
  }

  const handleStockChange = (size, stock) => {
    setSizes((prevSizes) =>
      prevSizes.map((item) =>
        item.size === size ? { ...item, stock: Number(stock) } : item
      )
    );
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item) =>
        item.size === size ? { ...item, stock: Number(stock) } : item
      ),
    }));
  };

  async function fetchProduct() {
    try {
      const response = await axiosInstance.get(`/admin/product/${id}`);

      setSizes(response.data.productData.sizes);
      return setProduct(response.data.productData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }

  async function fetchCategory() {
    try {
      const response = await axiosInstance.get("/admin/categories");
      setCategories(response.data.categoryData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 flex justify-center items-center bg-black opacity-90 w-screen h-screen">
          <h2 className="text-white text-2xl">
            Images Uploading to Database...
          </h2>
        </div>
      )}
      <CropperModal
        mainImage={selectedImage}
        setMainImage={setSelectedImage}
        setImageFiles={setImageFiles}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {/* loading */}
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 flex justify-center items-center bg-black opacity-90 w-screen h-screen">
          <h2 className="text-white text-2xl">
            Images Uploading to Database...
          </h2>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Edit Product</h1>
          <nav className="flex items-center gap-2 text-sm">
            <a href="/dashboard" className="text-gray-900 hover:text-gray-600">
              Dashboard
            </a>
            <span className="text-gray-400">/</span>
            <a href="/product" className="text-gray-900 hover:text-gray-600">
              product
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">add</span>
          </nav>
        </div>

        {/* Main Form */}
        <div className=" bg-[#f5f5f5] rounded-xl p-4 sm:p-6 lg:p-8">
          <div className=" grid lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                onClick={() =>
                  document.getElementById("mainImageInput").click()
                }
                className="relative aspect-[3/4] bg-white rounded-lg border-2 border-dashed border-[#e07d6a] hover:border-[#e07d6a] transition-all cursor-pointer overflow-hidden">
                {/* Remove Icon */}
                {Array.isArray(product.images) && product.images[0] && (
                  <img
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent click
                      setProduct((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, index) => index !== 0), // Remove the first image
                      }));
                    }}
                    className="absolute right-3 top-3 w-6 h-6 cursor-pointer"
                    src={closeIcon}
                    alt="Remove"
                  />
                )}

                {/* Main Image or Input */}
                {product &&
                Array.isArray(product.images) &&
                product.images[0] ? (
                  <img
                    src={product.images[0] || imageFiles[0]}
                    alt="Main product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* File Input */}
                    <input
                      id="mainImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageUpload}
                      className="hidden" // Hidden input
                    />
                    {/* Add Image Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-gray-400" />
                      <span className="mt-2 text-xs text-gray-500">
                        Add Main Image
                      </span>
                    </div>
                  </>
                )}
              </div>
              {error.images && (
                <p className="text-red-600 text-sm mt-1">{error.images}</p>
              )}

              {/* Additional Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.isArray(product.images) &&
                  product.images.slice(1, 5).map((image, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        document
                          .getElementById(`additionalImageInput${i}`)
                          .click()
                      }
                      className="relative aspect-[3/4] bg-white rounded-lg border-2 border-dashed border-[#e07d6a] hover:border-[#e07d6a] transition-all cursor-pointer">
                      <img
                        className="w-full h-full object-cover"
                        src={image ? image : imageFiles[i]}
                        alt=""
                      />

                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          setProduct((prev) => ({
                            ...prev,
                            images: prev.images.filter(
                              (_, ind) => ind - 1 !== i
                            ), // Remove the image at index i
                          }));
                        }}
                        className="absolute right-1 top-1 w-6 h-6"
                        src={closeIcon}
                        alt="Remove"
                      />
                    </div>
                  ))}

                {/* Add Image Input Field */}
                {Array.isArray(product.images) &&
                  product.images.length < 5 &&
                  [...Array(4 - (product.images.length - 1))].map((x, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() =>
                          document
                            .getElementById(
                              `additionalImageInput${product.images.length}`
                            )
                            .click()
                        }
                        className="relative aspect-[3/4] bg-white rounded-lg border-2 border-dashed border-[#e07d6a] hover:border-[#e07d6a] transition-all cursor-pointer">
                        {/* adding extra images  */}
                        {imageFiles[i] && (
                          <div className="w-full h-full">
                            <img
                              className="w-full h-full object-cover"
                              src={imageFiles[i]}
                              alt=""
                            />
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFiles((prev) =>
                                  prev.filter((_, index) => index !== 0)
                                );
                              }}
                              className="absolute right-1 top-1 w-6 h-6"
                              src={closeIcon}
                              alt="Remove"
                            />
                          </div>
                        )}
                        {!imageFiles[i] && (
                          <>
                            <input
                              id={`additionalImageInput${product.images.length}`}
                              type="file"
                              accept="image/*"
                              onChange={handleAdditionalImageUpload}
                              className="hidden"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImagePlus className="w-6 h-6 text-gray-400" />
                              <span className="mt-2 text-xs text-gray-500">
                                Add Image
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>

              {error.images && (
                <p className="text-red-600 text-sm mt-1">{error.images}</p>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name || ""}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter Product name here..."
                  className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none"
                />
                {error.name && (
                  <p className="text-red-600 text-sm mt-1">{error.name}</p>
                )}
              </div>

              {/* Stock Quantities */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stocks Quantity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {sizes.map(({ size, stock }) => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-8 text-sm font-medium">{size}</span>
                      <select
                        value={stock}
                        onChange={(e) =>
                          handleStockChange(size, e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none">
                        {[...Array(41)].map((_, i) => (
                          <option key={i} value={i}>
                            {i || "None"}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={product.price || ""}
                    onChange={(e) =>
                      setProduct((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="Enter Regular Price here..."
                    className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none"
                  />
                  {error.price && (
                    <p className="text-red-600 text-sm mt-1">{error.price}</p>
                  )}
                </div>
              </div>

              {/* Category and Sleeve Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={
                      product.category && typeof product.category === "object"
                        ? product.category._id
                        : product.category || ""
                    }
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none">
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {error.category && (
                    <p className="text-red-600 text-sm mt-1">
                      {error.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sleeve Type
                  </label>
                  <select
                    value={product.sleeve || "Select a sleeve"}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        sleeve: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none">
                    {sleeveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {error.sleeve && (
                    <p className="text-red-600 text-sm mt-1">{error.sleeve}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Description
                </label>
                <textarea
                  value={product.description || ""}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter Product Description here..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none"
                />
                {error.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.description}
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Information
                </label>
                <textarea
                  value={product.additionalInfo || ""}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      additionalInfo: e.target.value,
                    }))
                  }
                  placeholder="Enter Additional Information about the product here..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none"
                />
                {error.additionalInfo && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.additionalInfo}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button
                  onClick={() => navigate("/admin/productList")}
                  className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-6 py-2 rounded-lg bg-[#e07d6a] hover:bg-[#d16c59] text-white transition-colors">
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
