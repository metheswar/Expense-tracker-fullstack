import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

const ExpensePieChart = () => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const total = useSelector((state)=>state.expenses.totalExpenses);
  const [chartData, setChartData] = useState([["Category", "Amount"]]);

  useEffect(() => {
    const categoryMap = new Map();
    for (let expense of expenses) {
      const currentAmount = categoryMap.get(expense.category) || 0;
      const updatedAmount = currentAmount + expense.expenseamount;
      categoryMap.set(expense.category, updatedAmount);
    }


    const newChartData = [["Category", "Amount"]];
    for (let [category, amount] of categoryMap) {
      newChartData.push([category, amount]);
    }

  
    setChartData(newChartData);
  }, [expenses,total]);

  const chartOptions = {
    title: "Expense Distribution by Category",
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={chartOptions}
        width={"100%"}
        height={"400px"} 
      />
      <style>
        {`
          @media (max-width: 768px) {
            .google-visualization-chart {
              max-width: 100%;
              height: auto;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default ExpensePieChart;
