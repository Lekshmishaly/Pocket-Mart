import { useState } from "react";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "sonner";
import { validateCategory } from "@/Utils/ValidationFunctions";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  //states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  //functions
  async function handleAddCategory() {
    const validate = validateCategory(name, description, setError);
    if (validate) {
      try {
        const response = await axiosInstance.post("/admin/category", {
          name,
          description,
        });
        navigate("/admin/categoriesList");
        return toast.success(response.data.message);
      } catch (error) {
        console.log(error);
        if (error.response) {
          return toast.error(error.response.data.message);
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add Category</h1>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
          <span
            onClick={() => {
              navigate("/admin/dashboard");
            }}
            className="text-black hover:underline">
            Dashboard
          </span>
          <span className="text-gray-500">&gt;</span>
          <span
            onClick={() => {
              navigate("/admin/categoriesList");
            }}
            className="text-black hover:underline">
            Categories
          </span>
          <span className="text-gray-500">&gt;</span>
          <span className="text-gray-500">Add Category</span>
        </nav>

        {/* Main Content Card */}
        <div className=" bg-[#f5f5f5] rounded-lg shadow-sm p-6">
          <div>
            {/* General Information Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                General Information
              </h2>

              {/* Category Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type category name here..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error.name && (
                  <p className="text-red-600 text-sm mt-1">{error.name}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type category description here..."
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/categoriesList")}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#e07d6a] text-white hover:bg-[#9c4f3f] transition-colors">
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
