import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

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
  }, []);

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
                <th>Total Expense</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {index === 0 && <span style={{ marginLeft: '-25px', marginRight: '3px' }}>👑</span>}
                    {index + 1}
                  </td>
                  <td>{entry.name}</td>
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
