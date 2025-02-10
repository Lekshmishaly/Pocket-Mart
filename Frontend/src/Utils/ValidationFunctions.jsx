/////////////// User Signup Validation /////////////////

export function validateSignup(
  userFirstName,
  userLastName,
  userEmail,
  userMobile,
  userPassword,
  setError
) {
  const error = {};

  // Validate first name
  if (!userFirstName?.trim()) {
    error.userFirstName = "First name is required";
  } else if (userFirstName.trim().length < 3) {
    error.userFirstName = "First name must be at least 3 characters long";
  } else if (userFirstName.trim().length > 15) {
    error.userFirstName = "First name must not exceed 50 characters";
  } else if (/\s/.test(userFirstName.trim())) {
    error.userFirstName = "First name should not contain spaces";
  } else if (/\d/.test(userFirstName.trim())) {
    error.userFirstName = "First name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(userFirstName.trim())) {
    error.userFirstName = "First name can only contain letters or apostrophes";
  }

  // Validate last name
  if (!userLastName?.trim()) {
    error.userLastName = "Last name is required";
  } else if (userLastName.trim().length < 1) {
    error.userLastName = "Last name must be at least 1 characters long";
  } else if (userLastName.trim().length > 15) {
    error.userLastName = "Last name must not exceed 50 characters";
  } else if (/\s/.test(userLastName.trim())) {
    error.userLastName = "Last name should not contain spaces";
  } else if (/\d/.test(userLastName.trim())) {
    error.userLastName = "Last name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(userLastName.trim())) {
    error.userLastName = "Last name can only contain letters or apostrophes";
  }

  // Validate email
  if (!userEmail?.trim()) {
    error.userEmail = "Email is required";
  } else if (/^\d/.test(userEmail.trim())) {
    error.userEmail = "Email should not start with a number";
  } else if (!/^[a-z]/.test(userEmail.trim())) {
    error.userEmail = "Email must start with a lowercase letter";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail.trim())
  ) {
    error.userEmail = "Invalid email format";
  }

  // Validate mobile
  if (!userMobile?.trim()) {
    error.userMobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(userMobile)) {
    error.userMobile = "Mobile number should be 10 digits";
  }

  // Validate password
  if (!userPassword?.trim()) {
    error.userPassword = "Password is required";
  } else if (/\s/.test(userPassword)) {
    error.userPassword = "Password should not contain spaces";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(
      userPassword.trim()
    )
  ) {
    error.userPassword =
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number";
  }

  // Set error messages
  setError(error);

  // Return validation result
  return Object.keys(error).length === 0;
}

////////////// User Login /////////////////////

////////////// Add Category /////////////////////
export function validateCategory(name, description, setError) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Category name is required.";
  } else if (name.trim().length < 3) {
    error.name = "Category name must be at least 3 characters long.";
  } else if (name.trim().length > 20) {
    error.name = "Category name must not exceed 30 characters.";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Category name can only contain letters and spaces.";
  }

  if (!description?.trim()) {
    error.description = "Description is required.";
  } else if (description.trim().length < 5) {
    error.description = "Description must be at least 10 characters long.";
  } else if (description.trim().length > 200) {
    error.description = "Description must not exceed 200 characters.";
  } else if (/^\d/.test(description.trim())) {
    error.description = "Description must not start with a number.";
  } else if (/[^a-zA-Z0-9\s.-]/.test(description.trim())) {
    error.description =
      "Description can only contain letters, numbers, spaces, periods, or dashes.";
  } else if (/\s{2,}/.test(description.trim())) {
    error.description = "Description must not contain consecutive spaces.";
  } else if (/^[A-Za-z]+$/.test(description.trim().split(/\s+/)[0])) {
    const firstWord = description.trim().split(/\s+/)[0];
    if (firstWord.toLowerCase() === name.trim().toLowerCase()) {
      error.description =
        "Description cannot start with the same word as the category name.";
    }
  }

  setError(error);
  if (Object.keys(error).length === 0) {
    return true;
  }
  return false;
}

//////////////  validate Edit Category /////////////////////
export function validateEditCategory(name, description, setError) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Category name is required.";
  } else if (name.trim().length < 3) {
    error.name = "Category name must be at least 3 characters long.";
  } else if (name.trim().length > 20) {
    error.name = "Category name must not exceed 30 characters.";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Category name can only contain letters and spaces.";
  }

  if (!description?.trim()) {
    error.description = "Description is required.";
  } else if (description.trim().length < 5) {
    error.description = "Description must be at least 10 characters long.";
  } else if (description.trim().length > 200) {
    error.description = "Description must not exceed 200 characters.";
  } else if (/^\d/.test(description.trim())) {
    error.description = "Description must not start with a number.";
  } else if (/[^a-zA-Z0-9\s.-]/.test(description.trim())) {
    error.description =
      "Description can only contain letters, numbers, spaces, periods, or dashes.";
  } else if (/\s{2,}/.test(description.trim())) {
    error.description = "Description must not contain consecutive spaces.";
  } else if (/^[A-Za-z]+$/.test(description.trim().split(/\s+/)[0])) {
    const firstWord = description.trim().split(/\s+/)[0];
    if (firstWord.toLowerCase() === name.trim().toLowerCase()) {
      error.description =
        "Description cannot start with the same word as the category name.";
    }
  }

  setError(error);
  if (Object.keys(error).length === 0) {
    return true;
  }
  return false;
}

//////////////  validate add Products /////////////////////

export function validateAddProduct(
  name,
  price,
  description,
  additionalInfo,
  mainImage,
  imageFiles,
  category,
  sleeve,
  setError
) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Product name is required.";
  } else if (name.trim().length < 4) {
    error.name = "Product name must be at least 4 characters long.";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Product name can only contain letters and spaces.";
  }

  if (!price?.trim()) {
    error.price = "Price is required.";
  } else if (isNaN(price) || price <= 0) {
    error.price = "Price must be a positive number.";
  }

  if (!description?.trim()) {
    error.description = "Product description is required.";
  } else if (description?.trim() && description.trim().length < 10) {
    error.description = "Description must be at least 10 characters long.";
  }

  if (!additionalInfo?.trim()) {
    error.additionalInfo = "Product additionalInfo is required.";
  } else if (additionalInfo?.trim() && additionalInfo.trim().length < 10) {
    error.additionalInfo =
      "Additional information must be at least 10 characters long.";
  }

  if (!mainImage) {
    error.mainImage = "Main image is required.";
  }

  if (imageFiles.length === 0) {
    error.imageFiles = "At least one additional image is required.";
  }

  if (!category?.trim()) {
    error.category = "category is required.";
  }

  if (!sleeve?.trim()) {
    error.sleeve = "sleeve is required.";
  }

  setError(error);
  console.log("error object:::>", error);
  if (Object.keys(error).length === 0) {
    return true;
  }
  return false;
}
//////////////  validate edit Products /////////////////////

export function validateEditProduct(
  name,
  price,
  description,
  additionalInfo,
  images,
  exImages,
  category,
  sleeve,
  setError
) {
  const error = {};

  if (!name?.trim()) {
    error.name = "Product name is required.";
  } else if (name.trim().length < 4) {
    error.name = "Product name must be at least 4 characters long.";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    error.name = "Product name can only contain letters and spaces.";
  }

  if (!price || String(price).trim() === "") {
    error.price = "Price is required.";
  } else if (isNaN(price) || Number(price) <= 0) {
    error.price = "Price must be a positive number.";
  }

  if (!description?.trim()) {
    error.description = "Product description is required.";
  } else if (description?.trim() && description.trim().length < 10) {
    error.description = "Description must be at least 10 characters long.";
  }

  if (!additionalInfo?.trim()) {
    error.additionalInfo = "Product additionalInfo is required.";
  } else if (additionalInfo?.trim() && additionalInfo.trim().length < 10) {
    error.additionalInfo =
      "Additional information must be at least 10 characters long.";
  }
  if (!Array.isArray(images) || !Array.isArray(exImages)) {
    error.images = "Both images and existing images should be valid arrays.";
  } else if (images.length + exImages.length < 3) {
    error.images = "You must upload a total of at least 3 images.";
  }

  if (!category || String(category).trim() === "") {
    error.category = "Category is required.";
  }

  if (!sleeve?.trim()) {
    error.sleeve = "sleeve is required.";
  }

  setError(error);
  console.log("error object:::>", error);
  if (Object.keys(error).length === 0) {
    return true;
  }
  return false;
}

//////////////////////////// edit profile //////////////////
export function validateUserDetails(firstname, lastname, phone, setError) {
  const error = {};

  // Validate first name
  if (!firstname?.trim()) {
    error.firstname = "First name is required";
  } else if (firstname.trim().length < 3) {
    error.firstname = "First name must be at least 3 characters long";
  } else if (firstname.trim().length > 15) {
    error.firstname = "First name must not exceed 50 characters";
  } else if (/\s/.test(firstname.trim())) {
    error.firstname = "First name should not contain spaces";
  } else if (/\d/.test(firstname.trim())) {
    error.firstname = "First name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(firstname.trim())) {
    error.firstname = "First name can only contain letters or apostrophes";
  }

  // Validate last name
  if (!lastname?.trim()) {
    error.lastname = "Last name is required";
  } else if (lastname.trim().length < 1) {
    error.lastname = "Last name must be at least 3 characters long";
  } else if (lastname.trim().length > 15) {
    error.lastname = "Last name must not exceed 50 characters";
  } else if (/\s/.test(lastname.trim())) {
    error.lastname = "Last name should not contain spaces";
  } else if (/\d/.test(lastname.trim())) {
    error.lastname = "Last name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(lastname.trim())) {
    error.lastname = "Last name can only contain letters or apostrophes";
  }

  // Validate mobile
  if (!phone?.trim()) {
    error.phone = "Mobile number is required";
  } else if (!/^\d{10}$/.test(phone)) {
    error.phone = "Mobile number should be 10 digits";
  }

  // Set error messages
  setError(error);

  // Return validation result
  return Object.keys(error).length === 0;
}

////////////////////////  Addresss validation /////////////////////

export function validateAddress(
  firstname,
  lastname,
  email,
  phone,
  address,
  postalCode,
  landMark,
  city,
  district,
  state,
  country,
  setError
) {
  const error = {};

  // Validate first name
  if (!firstname?.trim()) {
    error.firstname = "First name is required";
  } else if (firstname.trim().length < 3) {
    error.firstname = "First name must be at least 3 characters long";
  } else if (firstname.trim().length > 15) {
    error.firstname = "First name must not exceed 15 characters";
  } else if (/\s/.test(firstname.trim())) {
    error.firstname = "First name should not contain spaces";
  } else if (/\d/.test(firstname.trim())) {
    error.firstname = "First name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(firstname.trim())) {
    error.firstname = "First name can only contain letters or apostrophes";
  }

  // Validate last name
  if (!lastname?.trim()) {
    error.lastname = "Last name is required";
  } else if (lastname.trim().length < 1) {
    error.lastname = "Last name must be at least 1 characters long";
  } else if (lastname.trim().length > 15) {
    error.lastname = "Last name must not exceed 15 characters";
  } else if (/\s/.test(lastname.trim())) {
    error.lastname = "Last name should not contain spaces";
  } else if (/\d/.test(lastname.trim())) {
    error.lastname = "Last name should not contain numbers";
  } else if (!/^[\p{L}']+$/u.test(lastname.trim())) {
    error.lastname = "Last name can only contain letters or apostrophes";
  }

  // Validate email
  if (!email?.trim()) {
    error.email = "Email is required";
  } else if (/^\d/.test(email.trim())) {
    error.email = "Email should not start with a number";
  } else if (!/^[a-z]/.test(email.trim())) {
    error.email = "Email must start with a lowercase letter";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
  ) {
    error.email = "Invalid email format";
  }

  // Validate phone
  if (!phone?.toString().trim()) {
    error.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(phone.toString())) {
    error.phone = "Phone number should be exactly 10 digits";
  }

  // Validate address
  if (!address?.trim()) {
    error.address = "Address is required";
  } else if (address.trim().length < 5) {
    error.address = "Address must be at least 5 characters long";
  } else if (address.trim().length > 100) {
    error.address = "Address must not exceed 100 characters";
  }

  // Validate landmark
  if (!landMark?.trim()) {
    error.landMark = "Landmark is required";
  } else if (landMark.trim().length < 3) {
    error.landMark = "Landmark must be at least 3 characters long";
  }

  // Validate postal code
  if (!postalCode?.toString().trim()) {
    error.postalCode = "Postal code is required";
  } else if (!/^\d{5,6}$/.test(postalCode.toString())) {
    error.postalCode = "Postal code must be 5 or 6 digits";
  }

  // Validate city
  if (!city?.trim()) {
    error.city = "City is required";
  } else if (city.trim().length < 3) {
    error.city = "City must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
    error.city = "City can only contain letters and spaces";
  }

  // Validate district
  if (!district?.trim()) {
    error.district = "District is required";
  } else if (district.trim().length < 3) {
    error.district = "District must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(district.trim())) {
    error.district = "District can only contain letters and spaces";
  }

  // Validate state
  if (!state?.trim()) {
    error.state = "State is required";
  } else if (state.trim().length < 3) {
    error.state = "State must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(state.trim())) {
    error.state = "State can only contain letters and spaces";
  }

  // Validate country
  if (!country?.trim()) {
    error.country = "Country is required";
  } else if (country.trim().length < 3) {
    error.country = "Country must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(country.trim())) {
    error.country = "Country can only contain letters and spaces";
  }

  // Set error messages
  setError(error);

  // Return validation result
  return Object.keys(error).length === 0;
}
