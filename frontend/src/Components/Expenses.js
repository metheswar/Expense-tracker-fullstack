import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense, updateExpense } from '../store/expenseSlice';
import ExpensesTable from './ExpensesTable';
import ExpensesModal from './ExpensesModal';
import ExpensesFilters from './ExpensesFilters';

const Expenses = () => {
  const expenses = useSelector((state) => state.expenses.expenses || []);
  const [expensesArray, setExpensesArray] = useState(expenses);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [monthFilter, setMonthFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');

  const deleteHandler = useCallback((id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/deleteExpense/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting expense: ${response.statusText}`);
        }

        console.log('Expense deleted successfully');
        dispatch(deleteExpense({ id }));
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error deleting expense:', error.message);
      });
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
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1];
    }

    return '';
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => (monthFilter ? new Date(expense.createdAt).getMonth() + 1 === monthFilter : true))
      .filter((expense) => (categoryFilter ? expense.category.toLowerCase() === categoryFilter.toLowerCase() : true));
  }, [expenses, monthFilter, categoryFilter]);

  useEffect(() => {
    setExpensesArray(filteredExpenses);
  }, [filteredExpenses]);

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
