import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/UserSlice";
import adminSlice from "./Slice/AdminSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
});

export default store;
