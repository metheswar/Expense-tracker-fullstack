import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addExpense } from '../store/expenseSlice';
import Expenses from './Expenses';

const InputForm = () => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !category) {
      return;
    }

    const token = localStorage.getItem('token');

    const newExpense = {
      amount: parseFloat(amount),
      description,
      category,
    };

    try {
      const response = await fetch('http://localhost:3001/postExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error(`Error posting expense: ${response.statusText}`);
      }

      const result = await response.json();
      dispatch(addExpense([result]));
    } catch (error) {
      console.error('Error posting expense:', error.message);
    }

    setAmount('');
    setDescription('');
    setCategory('');
  };

  return (
    <>
      <Card className="mt-4 mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center">Expense Tracker</Card.Title>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="fuel">Fuel</option>
                <option value="transport">Transport</option>
                <option value="miscellaneous">Miscellaneous</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Expenses />
    </>
  );
};

export default InputForm;
