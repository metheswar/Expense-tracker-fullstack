const { Op } = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/Expense');
const sequelize = require('../models/sequelize')

const getLeaderboard = async (req, res) => {
  try {
    // Use Sequelize's findAll with include and attributes for association and aggregation
    const results = await User.findAll({
      attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('expenses.expenseamount')), 'totalExpense']],
      include: [{
        model: Expense,
        attributes: [],
        duplicating: false,
      }],
      group: ['User.id'],
    });

    // Map the results to the desired format
    const formattedResults = results.map(user => ({
      name: user.name,
      totalExpense: user.dataValues.totalExpense || 0,
    }));

    // Send the results as JSON
    res.json(formattedResults);
  } catch (error) {
    // Handle errors and send a 500 Internal Server Error response
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getLeaderboard };
