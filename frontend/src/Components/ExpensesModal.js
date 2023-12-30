import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ExpensesModal = ({ showModal, setShowModal, selectedExpense, updatedAmount, setUpdatedAmount, updatedDescription, setUpdatedDescription, updatedCategory, setUpdatedCategory, deleteHandler, updateHandler }) => (
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
            as="select"
            size="sm"
            value={updatedCategory}
            onChange={(e) => setUpdatedCategory(e.target.value)}
            className="custom-select custom-select-sm"
          >
            <option value="food">Food</option>
            <option value="fuel">Fuel</option>
            <option value="transport">Transport</option>
            <option value="miscellaneous">Miscellaneous</option>
          </Form.Control>
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
);

export default ExpensesModal;