import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense, updateExpense } from '../store/expenseSlice';
import ExpensesTable from './ExpensesTable';
import ExpensesModal from './ExpensesModal';
import ExpensesFilters from './ExpensesFilters';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(({ expenses }) => expenses.expenses || []);
  const [expensesArray, setExpensesArray] = useState(expenses);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [monthFilter, setMonthFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');

  const filterExpenses = useCallback(
    (expense) => (
      (!monthFilter || new Date(expense.createdAt).getMonth() + 1 === monthFilter) &&
      (!categoryFilter || expense.category.toLowerCase() === categoryFilter.toLowerCase())
    ),
    [monthFilter, categoryFilter]
  );

  useEffect(() => {
    setExpensesArray(expenses.filter(filterExpenses));
  }, [expenses, monthFilter, categoryFilter, filterExpenses]);

  const deleteHandler = useCallback(async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3001/deleteExpense/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting expense: ${response.statusText}`);
      }

      console.log('Expense deleted successfully');
      dispatch(deleteExpense({ id }));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting expense:', error.message);
    }
  }, [dispatch]);

  const openUpdateModal = useCallback((expense) => {
    setSelectedExpense(expense);
    setUpdatedAmount(expense.expenseamount);
    setUpdatedDescription(expense.description);
    setUpdatedCategory(expense.category);
    setShowModal(true);
  }, []);

  const updateHandler = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/updateExpense/${selectedExpense.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: updatedAmount,
          description: updatedDescription,
          category: updatedCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating expense: ${response.statusText}`);
      }

      const updatedExpense = await response.json();

      dispatch(updateExpense({ id: selectedExpense.id, updatedExpense }));

      console.log('Expense updated successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating expense:', error.message);
    }
  }, [dispatch, selectedExpense, updatedAmount, updatedDescription, updatedCategory]);

  const getMonthLabel = useCallback((monthNumber) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1];
    }

    return '';
  }, []);

  return (
    <div className="mt-4 mx-auto">
      <ExpensesFilters setMonthFilter={setMonthFilter} setCategoryFilter={setCategoryFilter} getMonthLabel={getMonthLabel}/>
      {expensesArray.length === 0 ? (
        <div className="text-center">
          <h2>No expenses to display.</h2>
        </div>
      ) : (
        <>
          <ExpensesTable expensesArray={expensesArray} openUpdateModal={openUpdateModal} />
          <ExpensesModal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedExpense={selectedExpense}
            updatedAmount={updatedAmount}
            setUpdatedAmount={setUpdatedAmount}
            updatedDescription={updatedDescription}
            setUpdatedDescription={setUpdatedDescription}
            updatedCategory={updatedCategory}
            setUpdatedCategory={setUpdatedCategory}
            deleteHandler={deleteHandler}
            updateHandler={updateHandler}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(Expenses);
