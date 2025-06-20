import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { validateEditCategory } from "@/Utils/ValidationFunctions";
import axiosInstance from "@/Utils/AxiosConfig";

export default function EditCategory() {
  const [category, setCategory] = useState({});
  const [error, setError] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchCategory() {
    try {
      const response = await axiosInstance.get(`/admin/category/${id}`);
      return setCategory(response.data.categoryData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  }
  async function handleEditConform() {
    const validate = validateEditCategory(
      category.name,
      category.description,
      setError
    );

    if (validate) {
      try {
        const response = await axiosInstance.put("/admin/editcategory", {
          id,
          name: category.name,
          description: category.description,
        });
        toast.success(response.data.message);
        navigate("/admin/categoriesList");
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <div className="bg-[#f5f5f5] min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Edit Category</h1>
          <nav className="flex items-center gap-2 text-sm">
            <span
              onClick={() => navigate("/admin/dashboard")}
              className="text-black hover:underline">
              Dashboard
            </span>
            <span className="text-gray-500">&gt;</span>
            <span
              onClick={() => navigate("/admin/categoriesList")}
              className="text-black hover:underline cursor-pointer">
              Categories
            </span>
            <span className="text-gray-500">&gt;</span>
            <span className="text-gray-500">Edit Category</span>
          </nav>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">General Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={category.name || ""}
                    onChange={(e) =>
                      setCategory({ ...category, name: e.target.value })
                    }
                    className="mt-1.5"
                    required
                  />
                  {error.name && (
                    <p className="text-red-600 text-sm mt-1">{error.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={category.description || ""}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        description: e.target.value,
                      })
                    }
                    className="mt-1.5"
                    required
                  />
                  {error.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {error.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/categoriesList")}
                  className="bg-white hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleEditConform}
                  className="bg-[#e07d6a] hover:bg-[#9c4f3f] text-white">
                  Confirm Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
