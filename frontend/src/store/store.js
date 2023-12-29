import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import expenseSlice from "./expenseSlice";

const store = configureStore({
  reducer: {
    authentication: authSlice,
    expenses: expenseSlice,
  },
});

export default store;
