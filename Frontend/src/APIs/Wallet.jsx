import axiosInstance from "@/Utils/AxiosConfig";

export const addMoneytoWalletApi = async (amount, userID) => {
  return await axiosInstance.post("/user/wallet/add-money", { amount, userID });
};

export const fetchWalletInfoApi = async (userID, page = 1, limit = 8) => {
  return await axiosInstance.get("/user/wallet", {
    params: {
      userID,
      page,
      limit,
    },
  });
};

export const deductMoneyFromWalletApi = async (
  userID,
  orderID,
  total_amount
) => {
  try {
    const response = await axiosInstance.post("/user/wallet/deduct", {
      userID: userID,
      orderID: orderID,
      total_amount: total_amount,
    });

    return response.data; // Return only response data
  } catch (error) {
    console.error(
      "Error deducting money from wallet:",
      error.response?.data || error.message
    );
    throw error;
  }
};
