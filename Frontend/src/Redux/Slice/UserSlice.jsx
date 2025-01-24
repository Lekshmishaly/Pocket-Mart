import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails"))
      : null,
  },
  reducers: {
    addUser: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },
    logoutUser: (state, action) => {
      state.userDetails = null;
      localStorage.removeItem("userDetails");
    },
  },
});
export const { addUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
