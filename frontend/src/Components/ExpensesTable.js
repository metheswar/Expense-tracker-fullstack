import React, { useState, useMemo } from 'react';
import { Table, Pagination, Container, Row, Col } from 'react-bootstrap';

const ExpensesTable = React.memo(({ expensesArray, openUpdateModal }) => {
  const itemsPerPage = 4;
  const totalPages = Math.ceil(expensesArray.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentPageExpenses = useMemo(() => {
    const sortedExpenses = [...expensesArray].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExpenses.slice(startIndex, endIndex);
  }, [currentPage, expensesArray, itemsPerPage]);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <div className="table-responsive">
            <Table hover bordered striped responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => openUpdateModal(expense)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                    <td>{expense.description}</td>
                    <td>{expense.expenseamount.toFixed(2)}</td>
                    <td>{expense.category}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
});

export default ExpensesTable;
