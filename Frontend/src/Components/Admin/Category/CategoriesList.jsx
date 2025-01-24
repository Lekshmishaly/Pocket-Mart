import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { NotebookPen, Plus } from "lucide-react";
import axiosInstance from "@/Utils/AxiosConfig";
import { toast } from "react-toastify";
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

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  async function fetchCategory() {
    try {
      const response = await axiosInstance.get("/admin/categories");
      setCategories(response.data.categoryData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        return console.log(error.response.data.message);
      }
    }
  }

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

  function handleCategoryEdit(_id) {
    navigate(`/admin/edit-categories/${_id}`);
  }

  useEffect(() => {
    fetchCategory();
    setReload(false);
  }, [reload]);

  return (
    <div className="bg-[#f5f5f5] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Categories</h1>
            <nav className="flex items-center gap-2 text-sm">
              <a href="/dashboard" className="text-black hover:underline">
                Dashboard
              </a>
              <span className="text-gray-500">&gt;</span>
              <span className="text-gray-500">Categories</span>
            </nav>
          </div>
          <Button
            className="bg-[#e07d6a] hover:bg-[#9c4f3f] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit"
            onClick={() => navigate("/admin/add-category")}>
            <Plus className="h-5 w-5" />
            Add Category
          </Button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Category Name</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="text-right">
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
      </div>
    </div>
  );
}
