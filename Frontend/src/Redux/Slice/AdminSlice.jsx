import { createSlice } from "@reduxjs/toolkit";
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminDetails: localStorage.getItem("adminDetails")
      ? JSON.parse(localStorage.getItem("adminDetails"))
      : null,
  },
  reducers: {
    addAdmin: (state, action) => {
      state.adminDetails = action.payload;
      localStorage.setItem("adminDetails", JSON.stringify(action.payload));
    },
    logoutAdmin: (state, action) => {
      state.adminDetails = null;
      localStorage.removeItem("adminDetails");
    },
  },
});
export const { addAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
