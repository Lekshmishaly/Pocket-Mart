import { productOfferApi } from "@/APIs/Products/Offers";
import { validateOffer } from "@/Utils/ValidationFunctions";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductOffer = () => {
  const { id, productName } = useParams();
  const [offerName, setofferName] = useState("");
  const [offerValue, setofferValue] = useState(0);
  const [offerExpiryDate, setOfferExpairyDate] = useState();
  const [error, setError] = useState({});

  const navigate = useNavigate();
  async function handleAddOffer() {
    const validate = validateOffer(
      offerName,
      offerValue,
      offerExpiryDate,
      setError
    );

    if (validate) {
      try {
        const target_type = "Product";
        const response = await productOfferApi(
          id,
          productName,
          offerName,
          offerValue,
          offerExpiryDate,
          target_type
        );
        toast.success(response.data.message);
        navigate("/admin/productList");
      } catch (err) {
        console.log(err);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="bg-[#e07d6a] px-6 py-4">
            <h2 className="text-center text-3xl font-extrabold text-white">
              Add Product Offer
            </h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-center text-lg text-gray-600 mb-8">
              Target Product Name:
              <span className="font-semibold">{productName}</span>
            </p>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700">
                    Offer Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={offerName}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter offer name"
                    onChange={(e) => {
                      setofferName(e.target.value.toUpperCase());
                    }}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerName}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="offer_value"
                    className="block text-sm font-medium text-gray-700">
                    Offer Value
                  </label>
                  <input
                    id="offer_value"
                    name="offer_value"
                    type="number"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter offer value"
                    onChange={(e) => {
                      setofferValue(e.target.value);
                    }}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerValue}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    onChange={(e) => {
                      setOfferExpairyDate(e.target.value);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerExpiryDate}
                  </span>
                </div>
              </div>
              <div className="flex justify-around">
                <button
                  onClick={() => navigate("/admin/productList")}
                  className="py-3 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e07d6a] hover:bg-[#b87264] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out">
                  Cancel
                </button>

                <button
                  onClick={handleAddOffer}
                  className="py-3 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e07d6a] hover:bg-[#b87264] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out">
                  Add Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOffer;
