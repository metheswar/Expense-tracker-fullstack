

import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    totalExpenses: 0,
  },
  reducers: {
    addExpense: (state, action) => {
      state.expenses = [...state.expenses, ...action.payload];
      state.totalExpenses = state.expenses.reduce((total, expense) => total + expense.expenseamount, 0);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload.id);
      state.totalExpenses = state.expenses.reduce((total, expense) => total + expense.expenseamount, 0);
    },
    updateExpense: (state, action) => {

      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);


      if (index !== -1) {
        state.expenses[index] = {
          ...state.expenses[index],
          ...action.payload.updatedExpense,
        };

      
        state.totalExpenses = state.expenses.reduce((total, expense) => total + expense.expenseamount, 0);
      }
    },
    clear: (state, action) => {
      console.log('cleared');
      state.expenses = [];
      state.totalExpenses = 0;
    },
  },
});

export const { addExpense, deleteExpense, updateExpense, clear } = expenseSlice.actions;
export default expenseSlice.reducer;
