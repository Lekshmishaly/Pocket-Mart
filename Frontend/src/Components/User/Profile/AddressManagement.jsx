import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AddressForm from "./AddressForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axiosInstance from "@/Utils/AxiosConfig";
import { validateAddress } from "@/Utils/ValidationFunctions";
import countries from "world-countries";

function AddressManagement({ setSelectedAddressCheckout }) {
  const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
  }));

  const userData = useSelector((store) => store.user.userDetails);
  const navigate = useNavigate();
  // const [delete,setDeleted] = useState(null)

  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    landMark: "",
    city: "",
    country: "",
    district: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [editData, setEditData] = useState({});
  const [error, setError] = useState({});
  const [toDelete, setToDeleted] = useState(null);

  async function handleAddAddress() {
    const validate = validateAddress(
      formData.firstname,
      formData.lastname,
      formData.email,
      formData.phone,
      formData.address,
      formData.postalCode,
      formData.landMark,
      formData.city,
      formData.district,
      formData.state,
      formData.country,
      setError
    );
    if (validate) {
      try {
        const response = await axiosInstance.post("/user/address", {
          formData,
          userId: userData._id,
        });

        setIsAdding(false);
        toast.success(response.data.message);
        setReload(true);
        setFormData({});
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  }

  async function fetchAddresses() {
    try {
      const response = await axiosInstance.get(
        `/user/addresses/${userData._id}`
      );
      setAddresses(response.data.addressess);
    } catch (error) {
      if (error.response) {
        return console.log(error.response.data.message);
      }
    }
  }

  ///////////////////////////////////////////////// handle Edit Address //////////////////////////////////////////////

  async function handleEditAddress() {
    const validate = validateAddress(
      editData.firstname,
      editData.lastname,
      editData.email,
      editData.phone,
      editData.address,
      editData.postalCode,
      editData.landMark,
      editData.city,
      editData.district,
      editData.state,
      editData.country,
      setError
    );
    if (validate) {
      try {
        const response = await axiosInstance.put("/user/address/edit", {
          editData,
        });
        setEditData("");
        toast.success(response.data.message);
        setReload(true);
      } catch (error) {
        console.log(error);
        return toast.error(error.response.data.message);
      }
    }
  }

  ///////////////////////////////////////////////// handle Delete Address //////////////////////////////////////////////

  async function handleDeleteAddress() {
    try {
      const response = await axiosInstance.delete(`/user/address/${toDelete}`);
      setToDeleted(null);
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      console.log(err);
      return toast.error(err.response.data.message);
    }
  }

  useEffect(() => {
    fetchAddresses();
    setReload(false);
  }, [reload]);

  return (
    <div className="bg-[#f4ede3] p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 gap-2">
        <h2 className="text-[#8b5d4b] text-[13px] sm:text-sm font-Futura-Light leading-tight">
          Manage and add new shipping addresses.
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="relative text-[#8b5d4b] text-[13px] sm:text-sm font-Futura-Light font-semibold hover:text-[#6d483a] transition-colors duration-300 group">
          Add new address
          <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
        </button>
      </div>

      {addresses.length === 0 && (
        <div className="text-center text-sm mt-2 text-[#8b5d4b]">
          No address found
        </div>
      )}

      {isAdding && (
        <AddressForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          onSubmit={handleAddAddress}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {!isAdding && (
        <div className="w-full max-w-[800px] mx-auto ">
          {Array.isArray(addresses) &&
            addresses.map((address, i) => (
              <div
                key={address._id}
                className="border border-[#d4c9bc] rounded-lg py-6 px-4 sm:py-10 sm:px-6 bg-[#eae0d3] mb-5">
                <div className="relative w-full bg-[#f5ebe1] rounded-md border border-[#e4d5c7] px-4 py-3 md:px-5 md:py-4">
                  <div className="flex items-start gap-3">
                    {setSelectedAddressCheckout && (
                      <input
                        type="radio"
                        id="address"
                        name="select_address"
                        value={address._id}
                        onChange={() => setSelectedAddressCheckout(address)}
                        className="mt-1 md:mt-1.5"
                      />
                    )}

                    {/* Address Info */}
                    <div className="flex flex-col gap-0.5 w-full pr-20">
                      <span className="text-[#8b5d4b] text-[11px] sm:text-[13.5px] md:text-[13px] lg:text-[12.5px] font-Futura-Light leading-snug">
                        {address.firstname} {address.lastname}
                      </span>
                      <span className="text-[#8b5d4b] text-[11px] sm:text-[13.5px] md:text-[13px] lg:text-[12.5px] font-Futura-Light leading-snug">
                        {address.address} {address.state}, {address.country},{" "}
                        {address.postalCode}
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-4 flex gap-3 sm:gap-5">
                    <button
                      onClick={() => {
                        setSelectedAddress(userData.address);
                        setEditData(address);
                      }}
                      className="relative text-[#8b5d4b] text-[11px] sm:text-[13px] lg:text-[13px] font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                      Edit
                      <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                    </button>

                    <button
                      onClick={() => {
                        setToDeleted(address._id);
                        setShowDeleteDialog(true);
                      }}
                      className="relative text-[#8b5d4b] text-[11px] sm:text-[13px] lg:text-[13px] font-Futura-Light hover:text-[#6d483a] transition-colors duration-300 group">
                      Delete
                      <span className="absolute left-0 bottom-0 h-[1px] w-full bg-[#8b5d4b] transition-all duration-500 transform scale-x-100 group-hover:scale-x-50 origin-center"></span>
                    </button>
                  </div>
                </div>

                {Object.keys(editData).length !== 0 &&
                  editData._id === address._id && (
                    <div className="space-y-6">
                      <div className="mt-4">
                        <span className="text-[#5e2711] text-xl font-light font-[Satisfy]">
                          Edit Address
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                            First name
                          </label>
                          <input
                            type="text"
                            name="firstname"
                            value={editData.firstname}
                            onChange={(e) => {
                              setEditData((prev) => ({
                                ...prev,
                                firstname: e.target.value,
                              }));
                            }}
                            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                          />
                          {error?.firstname && (
                            <p className="text-red-600 text-sm mt-1">
                              {error.firstname}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                            Last name
                          </label>
                          <input
                            type="text"
                            name="lastname"
                            value={editData.lastname}
                            onChange={(e) => {
                              setEditData((prev) => ({
                                ...prev,
                                lastname: e.target.value,
                              }));
                            }}
                            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                          />
                          {error?.lastname && (
                            <p className="text-red-600 text-sm mt-1">
                              {error.lastname}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.email && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editData.phone}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.phone && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={editData.address}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.address && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.address}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Postal/ZIP code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={editData.postalCode}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              postalCode: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.postalCode && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.postalCode}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landMark"
                          value={editData.landMark}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              landMark: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.landMark && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.landMark}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.city && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.city}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          District
                        </label>
                        <input
                          type="text"
                          name="district"
                          value={editData.district}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              district: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.district && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.district}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={editData.state}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2"
                        />
                        {error?.state && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.state}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#8b5d4b] text-sm font-Futura-Light">
                          Country/Region
                        </label>
                        <select
                          name="country"
                          value={editData.country}
                          onChange={(e) => {
                            setEditData((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }));
                          }}
                          className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#ca8f78] text-sm font-Futura-Light pb-2">
                          <option value="">Select a country</option>
                          {countryOptions.map((country) => (
                            <option key={country.value} value={country.label}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        {error?.country && (
                          <p className="text-red-600 text-sm mt-1">
                            {error.country}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={handleEditAddress}
                          className="text-[#8b5d4b] text-sm border-b border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
                          Update Address
                        </button>
                        <button
                          onClick={() => {
                            setEditData({});
                          }}
                          className="text-[#8b5d4b] text-sm border-b border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#faf5f0] border-[#d4c9bc]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#8b5d4b] font-Futura-Light">
              Delete Address
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b5d4b] font-Futura-Light">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#8b5d4b] border-[#8b5d4b] hover:text-[#6d483a] hover:border-[#6d483a] font-Futura-Light">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="bg-[#8b5d4b] text-white hover:bg-[#6d483a] font-Futura-Light">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AddressManagement;
