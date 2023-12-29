import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense, updateExpense} from '../store/expenseSlice';

const Expenses = () => {
  const expensesArray = useSelector((state) => state.expenses.expenses || []);
  const dispatch = useDispatch();
 //let totalExpenses = useSelector((state)=>state.expenses.totalExpenses)  
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');



  const deleteHandler = (id) => {
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
  };

  const openUpdateModal = (expense) => {
    setSelectedExpense(expense);
    setUpdatedAmount(expense.expenseamount);
    setUpdatedDescription(expense.description);
    setUpdatedCategory(expense.category);
    setShowModal(true);
  };

  const updateHandler = async () => {
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
  };

  


  return (
    <div className="mt-4 mx-auto">
      {expensesArray.length === 0 ? (
        <div className="text-center">
          <h2>No expenses to display.</h2>
        </div>
      ) : (
        <>
          <Table striped bordered hover style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expensesArray.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{expense.expenseamount}</td>
                  <td>{expense.category}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => openUpdateModal(expense)}>
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedExpense.description}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={updatedAmount}
                    onChange={(e) => setUpdatedAmount(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedCategory}
                    onChange={(e) => setUpdatedCategory(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => deleteHandler(selectedExpense.id)}>
                Delete
              </Button>
              <Button variant="primary" onClick={updateHandler}>
                Update
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Expenses;
