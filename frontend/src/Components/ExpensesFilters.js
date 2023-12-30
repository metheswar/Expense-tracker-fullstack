import React from 'react';
import { Form, Col, Row, Container } from 'react-bootstrap';

const ExpensesFilters = React.memo(({ setMonthFilter, setCategoryFilter, getMonthLabel }) => (
  <Container className="mt-3">
    <Row className="justify-content-center">
      <Col xs={12} sm={6} md={4} lg={3} className="mb-2">
        <span className="mb-2 mb-sm-0" style={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
          Filter by Month:
        </span>
        <Form.Group controlId="formMonth" className="mb-2 mb-sm-0">
          <Form.Control
            as="select"
            size="sm"
            onChange={(e) => setMonthFilter(parseInt(e.target.value))}
            className="custom-select custom-select-sm"
            style={{ width: '100%', maxWidth: '200px' }}
          >
            <option value="0">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {getMonthLabel(month)}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>

      <Col xs={12} sm={6} md={4} lg={3} className="mb-2">
        <span className="mt-2 mt-sm-0" style={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
          Filter by Category:
        </span>
        <Form.Group controlId="formCategory" className="mb-2 mb-sm-0">
          <Form.Control
            as="select"
            size="sm"
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="custom-select custom-select-sm"
            style={{ width: '100%', maxWidth: '200px' }}
          >
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="fuel">Fuel</option>
            <option value="transport">Transport</option>
            <option value="miscellaneous">Miscellaneous</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
  </Container>
));

export default ExpensesFilters;