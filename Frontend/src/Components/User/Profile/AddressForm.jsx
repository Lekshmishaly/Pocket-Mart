import { useState } from "react";
import countries from "world-countries";

function AddressForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false,
  error,
}) {
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
  }));

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="max-w-2xl">
      <h3 className=" mb-8  text-[#5e2711] text-xl font-light font-[Satisfy]">
        {isEditing ? "Edit address" : "Add a new address"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[#8b5d4b] text-sm font-Futura-Light">
              First name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
            />
            {error.firstname && (
              <p className="text-red-600 text-sm mt-1">{error.firstname}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[#8b5d4b] text-sm font-Futura-Light">
              Last name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
            />
            {error.lastname && (
              <p className="text-red-600 text-sm mt-1">{error.lastname}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.email && (
            <p className="text-red-600 text-sm mt-1">{error.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.phone && (
            <p className="text-red-600 text-sm mt-1">{error.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.address && (
            <p className="text-red-600 text-sm mt-1">{error.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            Postal/ZIP code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.postalCode && (
            <p className="text-red-600 text-sm mt-1">{error.postalCode}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            LandMark
          </label>
          <input
            type="text"
            name="landMark"
            value={formData.landMark}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.landMark && (
            <p className="text-red-600 text-sm mt-1">{error.landMark}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.city && (
            <p className="text-red-600 text-sm mt-1">{error.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            District
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.district && (
            <p className="text-red-600 text-sm mt-1">{error.district}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2"
          />
          {error.state && (
            <p className="text-red-600 text-sm mt-1">{error.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[#8b5d4b] text-sm font-Futura-Light">
            Country/Region
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#8b5d4b] focus:outline-none focus:border-[#6d483a] text-[#8b5d4b] text-sm font-Futura-Light pb-2">
            <option value="">Select a country</option>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.label}>
                {country.label}
              </option>
            ))}
          </select>
          {error.country && (
            <p className="text-red-600 text-sm mt-1">{error.country}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="text-[#8b5d4b] text-sm border-b border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
            {isEditing ? "Update address" : "Add address"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#8b5d4b] text-sm border-b border-[#8b5d4b] hover:text-[#6d483a] transition-colors duration-200 font-Futura-Light">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
