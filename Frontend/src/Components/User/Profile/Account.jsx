import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { validateUserDetails } from "@/Utils/ValidationFunctions";
import { addUser } from "@/Redux/Slice/UserSlice";
import axiosInstance from "@/Utils/AxiosConfig";
import ReferralCode from "../Shared/ReferralCode";

function Account() {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user.userDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    phone: userData.phone,
  });

  // // Referral Code
  // const [referalCode, setReferalCode] = useState("");
  function handleUpdate() {
    setIsEditing(true);
  }

  async function handleSave() {
    const validate = validateUserDetails(
      formData.firstname,
      formData.lastname,
      formData.phone,
      setError
    );

    if (validate) {
      try {
        const response = await axiosInstance.put("/user/edit", {
          userId: userData._id,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
        });

        dispatch(addUser(response.data.update));
        setIsEditing(false);
        toast.success(response.data.message);
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred while updating profile");
        }
      }
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="bg-[#f4ede3] p-6">
        <div className="flex justify-between items-center mb-8 sm:mb-12 mt-4 sm:mt-0">
          <h2 className="text-[#8b5d4b] text-lg sm:text-xl font-Futura-Light">
            Personal Details
          </h2>
          {!isEditing && (
            <button
              onClick={handleUpdate}
              className="text-[#8b5d4b] text-sm sm:text-base border-b border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
              edit profile
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="max-w-2xl">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="firstname"
                    className="block text-[#8b5d4b] text-sm font-Futura-Light">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
                  />
                  {error.firstname && (
                    <p className="text-red-600 text-sm mt-1">
                      {error.firstname}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastname"
                    className="block text-[#8b5d4b] text-sm font-Futura-Light">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
                  />
                  {error.lastname && (
                    <p className="text-red-600 text-sm mt-1">
                      {error.lastname}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-[#8b5d4b] text-sm font-Futura-Light">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
                />
                {error.phone && (
                  <p className="text-red-600 text-sm mt-1">{error.phone}</p>
                )}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSave}
                  className="bg-[#8b5d4b] text-white px-6 py-2 rounded-md hover:bg-[#6d483a] transition-colors duration-200 text-sm font-Futura-Light">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[#8b5d4b] text-sm sm:text-base font-Futura-Light">
              {`${userData.firstname} ${userData.lastname}`}
            </p>
            <p className="text-[#8b5d4b] text-sm sm:text-base font-Futura-Light">
              {userData.phone}
            </p>
          </div>
        )}

        <div>
          <ReferralCode
            referralCode={userData.referralCode || "Not available"}
          />
        </div>
      </div>
    </>
  );
}

export default Account;
