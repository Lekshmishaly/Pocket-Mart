import { useEffect, useState } from "react";
import axiosInstance from "@/Utils/AxiosConfig";
import { ImagePlus } from "lucide-react";
import CropperModal from "../Shared/CropperModal";
import handleCloudinaryUpload from "@/Utils/handleCloudinaryUpload";

import closeIcon from "../../../../src/assets/close.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateAddProduct } from "@/Utils/ValidationFunctions";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const sleeveTypes = [
    "Full Sleeve",
    "Half Sleeve",
    "Sleeveless",
    "Short Sleeve",
  ];
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState([
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState({});

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

  const handleStockChange = (size, stock) => {
    setSizes((prevSizes) =>
      prevSizes.map((item) =>
        item.size === size ? { ...item, stock: Number(stock) } : item
      )
    );
  };

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

  async function handleAddProduct() {
    const validate = validateAddProduct(
      name,
      price,
      description,
      additionalInfo,
      mainImage,
      imageFiles,
      category,
      sleeve,
      setError
    );

    if (validate) {
      try {
        //handle image upload to clodinary
        setIsLoading(true);
        const images = await handleCloudinaryUpload(mainImage, imageFiles);
        const response = await axiosInstance.post("/admin/addproduct", {
          name,
          sizes,
          price,
          category,
          sleeve,
          description,
          additionalInfo,
          images,
        });
        setIsLoading(false);
        navigate("/admin/productList");

        return toast.success(response.data.message);
      } catch (error) {
        console.log(error);
        if (error.response) {
          return toast.error(error.response.data.message);
        }
      }
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* loading */}
      {isLoading && (
        <div className="fixed top-0 left-0 z-50 flex justify-center items-center bg-black opacity-90 w-screen h-screen">
          <h2 className="text-white text-2xl">
            Images Uploading to Database...
          </h2>
        </div>
      )}
      <CropperModal
        mainImage={mainImage}
        setMainImage={setMainImage}
        setImageFiles={setImageFiles}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Add Product</h1>
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
                {mainImage && (
                  <img
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainImage("");
                    }}
                    className="absolute right-3 top-3 w-10 h-10"
                    src={closeIcon}
                    alt="Remove"
                  />
                )}

                <input
                  id="mainImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="hidden"
                />
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Upload Main Image
                    </span>
                  </div>
                )}
              </div>
              {error.mainImage && (
                <p className="text-red-600 text-sm mt-1">{error.mainImage}</p>
              )}

              {/* Additional Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imageFiles.map((image, i) => (
                  <div
                    key={i}
                    className="relative aspect-[3/4] bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
                    <img
                      src={image}
                      alt={`Product ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle removing the image
                        const updatedImages = [...imageFiles];
                        updatedImages.splice(i, 1);
                        setImageFiles(updatedImages);
                      }}
                      className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
                      src={closeIcon}
                      alt="Remove"
                    />
                  </div>
                ))}
                {[...Array(4 - imageFiles.length)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      document
                        .getElementById(`additionalImageInput${i}`)
                        .click()
                    }
                    className="relative aspect-[3/4] bg-white rounded-lg border-2 border-dashed border-[#e07d6a] hover:border-[#e07d6a] transition-all cursor-pointer">
                    <input
                      id={`additionalImageInput${i}`}
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
                  </div>
                ))}
              </div>
              {error.imageFiles && (
                <p className="text-red-600 text-sm mt-1">{error.imageFiles}</p>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none">
                    <option value="">Select Category</option>
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
                    value={sleeve}
                    onChange={(e) => setSleeve(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-[#e07d6a] focus:ring-[#e07d6a] focus:ring-2 outline-none">
                    <option value="">Select Sleeve Type</option>
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
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
                  onClick={handleAddProduct}
                  className="px-6 py-2 rounded-lg bg-[#e07d6a] hover:bg-[#d16c59] text-white transition-colors">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
