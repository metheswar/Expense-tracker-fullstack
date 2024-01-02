import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const expenses = useSelector((state) => state.expenses.expenses);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/leaderboard');
        const data = await response.json();
        const sortedLeaderboard = data.sort((a, b) => b.totalExpense - a.totalExpense);
        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [expenses]);

  const email = localStorage.getItem('email');

  return (
    <Container>
      <Row>
        <Col>
          <h2>Leaderboard</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Email</th>
                <th>Total Expense</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard
                .filter((entry) => entry.premium)
                .map((entry, index) => (
                  <tr
                    key={index}
                    className={entry.email === email ? 'table-success' : ''}
                  >
                    <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      {index === 0 && <span style={{ marginLeft: '-25px', marginRight: '3px' }}>🥇</span>}
                      {index === 1 && <span style={{ marginLeft: '-25px', marginRight: '3px' }}>🥈</span>}
                      {index === 2 && <span style={{ marginLeft: '-25px', marginRight: '3px' }}>🥉</span>}
                      {index + 1}
                    </td>
                    <td>{entry.name}{entry.email === email ? <span> (You)</span> : ''}</td>
                    <td>{entry.email}</td>
                    <td>{entry.totalExpense}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Leaderboard;
