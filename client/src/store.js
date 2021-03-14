import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user";

export default configureStore({
  reducer: {
    user: userSlice.reducer
  }
});
